"use client";
import React, { useState } from 'react';
import BookingSuccessCard from './BookingSuccessCard';
const mockAuthData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  batch: 'FSD-2023',
  tag: 'student-123',
  phone_number: '+1234567890',
};

const availableTimeSlots = {
  Monday: ['10:00', '12:00', '14:00', '16:00'],
  Tuesday: ['09:00', '11:00', '13:00', '15:00'],
  Wednesday: ['10:00', '12:00', '14:00'],
  Thursday: ['09:00', '11:00', '13:00'],
  Friday: ['10:00', '14:00', '16:00'],
};

const PeerProgrammingBookingCard = ({ onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    auth: mockAuthData,
    topic: {
      type: '',
      detailed_description: '',
    },
    teacher_id: '',
    session_type: '',
    schedule: {
      date: '',
      time: '',
    },
    problem_description: '',
    group_or_solo: 'solo',
    group_members: [],
  });

  const [emailInput, setEmailInput] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEmailInput = (e) => {
    const value = e.target.value;
    setEmailInput(value);
    
    if (value.endsWith(',')) {
      const email = value.slice(0, -1).trim();
      if (email && !formData.group_members.includes(email)) {
        setFormData(prev => ({
          ...prev,
          group_members: [...prev.group_members, email]
        }));
      }
      setEmailInput('');
    }
  };

  const removeEmail = (emailToRemove) => {
    setFormData(prev => ({
      ...prev,
      group_members: prev.group_members.filter(email => email !== emailToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setFormData(prev => ({
        ...prev,
        group_members: [...prev.group_members, emailInput.trim()]
      }));
    }
    console.log('Form Data Submitted:', {
      ...formData,
      group_members: emailInput.trim() ? [...formData.group_members, emailInput.trim()] : formData.group_members
    });
    setShowSuccess(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl mx-auto overflow-y-auto my-8 max-h-[90vh] relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
          
          <h1 className="text-3xl font-bold text-black mb-6">Peer Programming Booking</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Auth Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Your Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.auth.name}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.auth.email}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Batch</label>
                  <input
                    type="text"
                    value={formData.auth.batch}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.auth.phone_number}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Topic Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Session Details</h2>
              <input
                type="text"
                name="topic.type"
                value={formData.topic.type}
                onChange={handleChange}
                placeholder="Topic Type (e.g., DSA)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <textarea
                name="topic.detailed_description"
                value={formData.topic.detailed_description}
                onChange={handleChange}
                placeholder="Detailed Description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
              />
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Select Time Slot</h2>
              <div className="flex flex-wrap gap-2">
                {Object.keys(availableTimeSlots).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedDay === day
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    } transition duration-300`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableTimeSlots[selectedDay].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        schedule: { ...prev.schedule, time, date: selectedDay },
                      }))
                    }
                    className={`p-3 border rounded-lg ${
                      formData.schedule.time === time
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    } transition duration-300`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Problem Description</h2>
              <textarea
                name="problem_description"
                value={formData.problem_description}
                onChange={handleChange}
                placeholder="Describe your problem"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
              />
            </div>

            {/* Group or Solo */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Session Type</h2>
              <select
                name="group_or_solo"
                value={formData.group_or_solo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="solo">Solo</option>
                <option value="group">Group</option>
              </select>
            </div>

            {/* Group Members */}
            {formData.group_or_solo === 'group' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-black">Group Members</h2>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={emailInput}
                    onChange={handleEmailInput}
                    placeholder="Enter email and press comma to add"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.group_members.map((email, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => removeEmail(email)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Book Session
            </button>
          </form>
        </div>
      </div>
      
      {showSuccess && (
        <BookingSuccessCard
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
          bookingDetails={formData}
        />
      )}
    </>
  );
};

export default PeerProgrammingBookingCard;