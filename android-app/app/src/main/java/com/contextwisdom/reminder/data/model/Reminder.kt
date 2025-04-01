package com.contextwisdom.reminder.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "reminders")
data class Reminder(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String,
    val startTime: Date,
    val endTime: Date,
    val attendees: List<String>,
    val location: String? = null,
    val calendarEventId: String? = null,
    val isSynced: Boolean = false
) 