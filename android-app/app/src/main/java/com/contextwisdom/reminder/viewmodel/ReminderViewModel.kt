package com.contextwisdom.reminder.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.contextwisdom.reminder.data.db.ReminderDatabase
import com.contextwisdom.reminder.data.model.Reminder
import com.contextwisdom.reminder.service.CalendarService
import com.contextwisdom.reminder.service.EmailService
import kotlinx.coroutines.launch
import java.util.Date

class ReminderViewModel(application: Application) : AndroidViewModel(application) {
    private val database = ReminderDatabase.getDatabase(application)
    private val reminderDao = database.reminderDao()
    private val calendarService = CalendarService(application)
    private val emailService = EmailService(application)

    private val _reminders = MutableLiveData<List<Reminder>>()
    val reminders: LiveData<List<Reminder>> = _reminders

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    init {
        loadReminders()
    }

    private fun loadReminders() {
        viewModelScope.launch {
            try {
                _reminders.value = reminderDao.getAllReminders()
            } catch (e: Exception) {
                _error.value = "Failed to load reminders: ${e.message}"
            }
        }
    }

    fun createReminder(reminder: Reminder) {
        viewModelScope.launch {
            try {
                // Save to local database
                val id = reminderDao.insertReminder(reminder)

                // Create calendar event
                val calendarEventId = calendarService.createEvent(reminder)

                // Send email invite
                emailService.sendCalendarInvite(reminder)

                // Update reminder with calendar event ID
                reminderDao.updateReminder(reminder.copy(calendarEventId = calendarEventId, isSynced = true))
                loadReminders()
            } catch (e: Exception) {
                _error.value = "Failed to create reminder: ${e.message}"
            }
        }
    }

    fun deleteReminder(reminder: Reminder) {
        viewModelScope.launch {
            try {
                // Delete from calendar if synced
                reminder.calendarEventId?.let { calendarService.deleteEvent(it) }

                // Delete from local database
                reminderDao.deleteReminder(reminder)
                loadReminders()
            } catch (e: Exception) {
                _error.value = "Failed to delete reminder: ${e.message}"
            }
        }
    }

    fun updateReminder(reminder: Reminder) {
        viewModelScope.launch {
            try {
                // Update calendar event if synced
                if (reminder.isSynced) {
                    reminder.calendarEventId?.let { calendarService.deleteEvent(it) }
                    val newCalendarEventId = calendarService.createEvent(reminder)
                    reminderDao.updateReminder(reminder.copy(calendarEventId = newCalendarEventId))
                } else {
                    reminderDao.updateReminder(reminder)
                }
                loadReminders()
            } catch (e: Exception) {
                _error.value = "Failed to update reminder: ${e.message}"
            }
        }
    }

    fun initializeEmailService(
        host: String,
        port: Int,
        username: String,
        password: String,
        useSSL: Boolean = true
    ) {
        emailService.initialize(host, port, username, password, useSSL)
    }

    fun handleGoogleSignInResult(account: com.google.android.gms.auth.api.signin.GoogleSignInAccount) {
        calendarService.handleSignInResult(account)
    }

    fun getGoogleSignInIntent() = calendarService.getSignInIntent()

    override fun onCleared() {
        super.onCleared()
        emailService.close()
    }
} 