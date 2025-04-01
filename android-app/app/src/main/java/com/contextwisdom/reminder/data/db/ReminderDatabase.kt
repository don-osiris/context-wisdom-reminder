package com.contextwisdom.reminder.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.contextwisdom.reminder.data.model.Reminder

@Database(entities = [Reminder::class], version = 1)
@TypeConverters(Converters::class)
abstract class ReminderDatabase : RoomDatabase() {
    abstract fun reminderDao(): ReminderDao

    companion object {
        @Volatile
        private var INSTANCE: ReminderDatabase? = null

        fun getDatabase(context: Context): ReminderDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ReminderDatabase::class.java,
                    "reminder_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}

@androidx.room.Dao
interface ReminderDao {
    @androidx.room.Query("SELECT * FROM reminders ORDER BY startTime ASC")
    suspend fun getAllReminders(): List<Reminder>

    @androidx.room.Insert
    suspend fun insertReminder(reminder: Reminder): Long

    @androidx.room.Update
    suspend fun updateReminder(reminder: Reminder)

    @androidx.room.Delete
    suspend fun deleteReminder(reminder: Reminder)

    @androidx.room.Query("SELECT * FROM reminders WHERE id = :id")
    suspend fun getReminderById(id: Long): Reminder?
}

class Converters {
    @androidx.room.TypeConverter
    fun fromTimestamp(value: Long?): java.util.Date? {
        return value?.let { java.util.Date(it) }
    }

    @androidx.room.TypeConverter
    fun dateToTimestamp(date: java.util.Date?): Long? {
        return date?.time
    }

    @androidx.room.TypeConverter
    fun fromString(value: String): List<String> {
        return value.split(",")
    }

    @androidx.room.TypeConverter
    fun toString(list: List<String>): String {
        return list.joinToString(",")
    }
} 