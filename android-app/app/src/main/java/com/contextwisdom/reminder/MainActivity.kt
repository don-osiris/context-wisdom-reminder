package com.contextwisdom.reminder

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.contextwisdom.reminder.adapter.ReminderAdapter
import com.contextwisdom.reminder.data.model.Reminder
import com.contextwisdom.reminder.databinding.ActivityMainBinding
import com.contextwisdom.reminder.databinding.DialogReminderBinding
import com.contextwisdom.reminder.viewmodel.ReminderViewModel
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.common.api.ApiException
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private val viewModel: ReminderViewModel by viewModels()
    private lateinit var adapter: ReminderAdapter
    private val dateFormat = SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault())

    companion object {
        private const val RC_SIGN_IN = 9001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        setupRecyclerView()
        setupFab()
        observeViewModel()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(false)
    }

    private fun setupRecyclerView() {
        adapter = ReminderAdapter(
            onItemClick = { reminder ->
                showReminderDialog(reminder)
            },
            onItemLongClick = { reminder ->
                showDeleteConfirmation(reminder)
            }
        )

        binding.remindersRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = this@MainActivity.adapter
        }
    }

    private fun setupFab() {
        binding.addReminderFab.setOnClickListener {
            showReminderDialog(null)
        }
    }

    private fun showReminderDialog(reminder: Reminder?) {
        val dialogBinding = DialogReminderBinding.inflate(LayoutInflater.from(this))
        val isEdit = reminder != null

        // Pre-fill fields if editing
        if (isEdit) {
            dialogBinding.apply {
                titleEditText.setText(reminder?.title)
                descriptionEditText.setText(reminder?.description)
                startTimeEditText.setText(dateFormat.format(reminder?.startTime))
                endTimeEditText.setText(dateFormat.format(reminder?.endTime))
                locationEditText.setText(reminder?.location)
                attendeesEditText.setText(reminder?.attendees?.joinToString(", "))
            }
        }

        // Setup date/time pickers
        val startCalendar = Calendar.getInstance()
        val endCalendar = Calendar.getInstance()
        reminder?.startTime?.let { startCalendar.time = it }
        reminder?.endTime?.let { endCalendar.time = it }

        dialogBinding.startTimeEditText.setOnClickListener {
            showDateTimePicker(startCalendar) { date ->
                dialogBinding.startTimeEditText.setText(dateFormat.format(date))
            }
        }

        dialogBinding.endTimeEditText.setOnClickListener {
            showDateTimePicker(endCalendar) { date ->
                dialogBinding.endTimeEditText.setText(dateFormat.format(date))
            }
        }

        AlertDialog.Builder(this)
            .setTitle(if (isEdit) R.string.edit_reminder else R.string.add_reminder)
            .setView(dialogBinding.root)
            .setPositiveButton(R.string.save) { _, _ ->
                val title = dialogBinding.titleEditText.text.toString()
                val description = dialogBinding.descriptionEditText.text.toString()
                val location = dialogBinding.locationEditText.text.toString()
                val attendees = dialogBinding.attendeesEditText.text.toString()
                    .split(",")
                    .map { it.trim() }
                    .filter { it.isNotEmpty() }

                val newReminder = Reminder(
                    id = reminder?.id ?: 0,
                    title = title,
                    description = description,
                    startTime = startCalendar.time,
                    endTime = endCalendar.time,
                    location = location.takeIf { it.isNotEmpty() },
                    attendees = attendees,
                    calendarEventId = reminder?.calendarEventId,
                    isSynced = reminder?.isSynced ?: false
                )

                if (isEdit) {
                    viewModel.updateReminder(newReminder)
                } else {
                    viewModel.createReminder(newReminder)
                }
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun showDateTimePicker(calendar: Calendar, onDateSelected: (Date) -> Unit) {
        DatePickerDialog(
            this,
            { _, year, month, day ->
                calendar.set(Calendar.YEAR, year)
                calendar.set(Calendar.MONTH, month)
                calendar.set(Calendar.DAY_OF_MONTH, day)

                TimePickerDialog(
                    this,
                    { _, hour, minute ->
                        calendar.set(Calendar.HOUR_OF_DAY, hour)
                        calendar.set(Calendar.MINUTE, minute)
                        onDateSelected(calendar.time)
                    },
                    calendar.get(Calendar.HOUR_OF_DAY),
                    calendar.get(Calendar.MINUTE),
                    true
                ).show()
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        ).show()
    }

    private fun showDeleteConfirmation(reminder: Reminder) {
        AlertDialog.Builder(this)
            .setTitle(R.string.delete_reminder)
            .setMessage(R.string.confirm_delete)
            .setPositiveButton(R.string.delete) { _, _ ->
                viewModel.deleteReminder(reminder)
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun observeViewModel() {
        viewModel.reminders.observe(this) { reminders ->
            adapter.submitList(reminders)
        }

        viewModel.error.observe(this) { error ->
            Toast.makeText(this, error, Toast.LENGTH_LONG).show()
        }
    }

    override fun onStart() {
        super.onStart()
        // Check if user is signed in
        val account = GoogleSignIn.getLastSignedInAccount(this)
        if (account == null) {
            // Start sign-in flow
            startActivityForResult(viewModel.getGoogleSignInIntent(), RC_SIGN_IN)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                viewModel.handleGoogleSignInResult(account)
            } catch (e: ApiException) {
                Toast.makeText(this, getString(R.string.google_sign_in_failed), Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        viewModel.onCleared()
    }
} 