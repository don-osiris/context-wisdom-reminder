package com.contextwisdom.reminder.service

import android.content.Context
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.calendar.Calendar
import com.google.api.services.calendar.CalendarScopes
import com.google.api.services.calendar.model.Event
import com.google.api.services.calendar.model.EventDateTime
import com.contextwisdom.reminder.data.model.Reminder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.Date

class CalendarService(private val context: Context) {
    private var calendarService: Calendar? = null
    private var googleSignInClient: GoogleSignInClient? = null

    init {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestScopes(CalendarScopes.CALENDAR)
            .build()

        googleSignInClient = GoogleSignIn.getClient(context, gso)
    }

    fun getSignInIntent() = googleSignInClient?.signInIntent

    fun handleSignInResult(account: GoogleSignInAccount) {
        val credential = GoogleAccountCredential.usingOAuth2(
            context,
            listOf(CalendarScopes.CALENDAR)
        ).apply {
            selectedAccount = account.account
        }

        calendarService = Calendar.Builder(
            NetHttpTransport(),
            GsonFactory(),
            credential
        )
            .setApplicationName("Context Wisdom Reminder")
            .build()
    }

    suspend fun createEvent(reminder: Reminder): String = withContext(Dispatchers.IO) {
        val event = Event()
            .setSummary(reminder.title)
            .setDescription(reminder.description)
            .setStart(EventDateTime().setDateTime(com.google.api.client.util.DateTime(reminder.startTime)))
            .setEnd(EventDateTime().setDateTime(com.google.api.client.util.DateTime(reminder.endTime)))
            .setAttendees(reminder.attendees.map { com.google.api.services.calendar.model.EventAttendee().setEmail(it) })

        reminder.location?.let { event.setLocation(it) }

        calendarService?.events()?.insert("primary", event)?.execute()?.id
            ?: throw Exception("Failed to create calendar event")
    }

    suspend fun deleteEvent(eventId: String) = withContext(Dispatchers.IO) {
        calendarService?.events()?.delete("primary", eventId)?.execute()
            ?: throw Exception("Failed to delete calendar event")
    }

    suspend fun listEvents(startTime: Date, endTime: Date): List<Event> = withContext(Dispatchers.IO) {
        calendarService?.events()?.list("primary")
            ?.setTimeMin(com.google.api.client.util.DateTime(startTime))
            ?.setTimeMax(com.google.api.client.util.DateTime(endTime))
            ?.setSingleEvents(true)
            ?.setOrderBy("startTime")
            ?.execute()
            ?.items
            ?: emptyList()
    }

    fun signOut() {
        googleSignInClient?.signOut()
        calendarService = null
    }
} 