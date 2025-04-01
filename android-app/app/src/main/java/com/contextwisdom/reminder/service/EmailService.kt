package com.contextwisdom.reminder.service

import android.content.Context
import com.sun.mail.android.mail.Session
import com.sun.mail.android.mail.Transport
import com.sun.mail.android.mail.Message
import com.sun.mail.android.mail.Multipart
import com.sun.mail.android.mail.internet.InternetAddress
import com.sun.mail.android.mail.internet.MimeMessage
import com.sun.mail.android.mail.internet.MimeMultipart
import com.sun.mail.android.mail.internet.MimeBodyPart
import com.contextwisdom.reminder.data.model.Reminder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.Properties
import java.util.Date

class EmailService(private val context: Context) {
    private var session: Session? = null
    private var transport: Transport? = null

    fun initialize(
        host: String,
        port: Int,
        username: String,
        password: String,
        useSSL: Boolean = true
    ) {
        val props = Properties().apply {
            put("mail.smtp.host", host)
            put("mail.smtp.port", port)
            put("mail.smtp.auth", "true")
            if (useSSL) {
                put("mail.smtp.starttls.enable", "true")
                put("mail.smtp.ssl.enable", "true")
            }
        }

        session = Session.getInstance(props, null)
        transport = session?.getTransport("smtp")
        transport?.connect(host, port, username, password)
    }

    suspend fun sendCalendarInvite(reminder: Reminder) = withContext(Dispatchers.IO) {
        val message = MimeMessage(session).apply {
            setFrom(InternetAddress(reminder.attendees.first()))
            setRecipients(Message.RecipientType.TO, reminder.attendees.map { InternetAddress(it) }.toTypedArray())
            subject = "Calendar Invite: ${reminder.title}"
        }

        val multipart = MimeMultipart("mixed")
        
        // Add text part
        val textPart = MimeBodyPart().apply {
            setText(reminder.description)
        }
        multipart.addBodyPart(textPart)

        // Add calendar part
        val calendarPart = MimeBodyPart().apply {
            setContent(generateICalEvent(reminder), "text/calendar; method=REQUEST; charset=UTF-8")
            setHeader("Content-Class", "urn:content-classes:calendarmessage")
        }
        multipart.addBodyPart(calendarPart)

        message.setContent(multipart)
        transport?.sendMessage(message, message.allRecipients)
    }

    private fun generateICalEvent(reminder: Reminder): String {
        val formatDate = { date: Date ->
            date.toInstant().toString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
        }

        return buildString {
            appendLine("BEGIN:VCALENDAR")
            appendLine("VERSION:2.0")
            appendLine("BEGIN:VEVENT")
            appendLine("DTSTART:${formatDate(reminder.startTime)}")
            appendLine("DTEND:${formatDate(reminder.endTime)}")
            reminder.location?.let { appendLine("LOCATION:$it") }
            appendLine("DESCRIPTION:${reminder.description}")
            appendLine("END:VEVENT")
            appendLine("END:VCALENDAR")
        }
    }

    fun close() {
        transport?.close()
        transport = null
        session = null
    }
} 