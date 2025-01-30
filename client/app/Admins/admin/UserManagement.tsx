'use client';

import { useState, useEffect } from 'react';
import { Search, Users, X, CheckCircle2, Ban, Shield, UserPlus, Sun, Moon } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [category, setCategory] = useState('student');
  const [customPermissions, setCustomPermissions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPermissionsUser, setViewPermissionsUser] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Clear feedback message after 3 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Apply search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchQuery]);

  const fetchUsers = async (tab) => {
    try {
      const response = await fetch(`/api/userStatus/approve?filter=${tab}`);
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setFeedbackMessage('Failed to fetch users');
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchQuery(''); // Clear search when changing tabs
    fetchUsers(tab);
  };

  // Rest of the handler functions remain the same...
  const handleApprove = async (email) => {
    try {
      const response = await fetch('/api/userStatus/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          status: 'approved',
          category,
          customPermissions,
        }),
      });

      if (response.ok) {
        setFeedbackMessage('User approved successfully');
        fetchUsers(activeTab);
        setIsModalOpen(false);
      } else {
        setFeedbackMessage('Failed to approve user');
      }
    } catch (error) {
      setFeedbackMessage('An error occurred while approving the user');
    }
  };

  const handleBlock = async (email) => {
    try {
      const response = await fetch('/api/userStatus/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, status: 'blocked' }),
      });

      if (response.ok) {
        setFeedbackMessage('User blocked successfully');
        fetchUsers(activeTab);
      } else {
        setFeedbackMessage('Failed to block user');
      }
    } catch (error) {
      setFeedbackMessage('An error occurred while blocking the user');
    }
  };

  const handleUpdatePermissions = async (email) => {
    try {
      const response = await fetch('/api/userStatus/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          status: 'approved',
          category: viewPermissionsUser.category,
          customPermissions,
        }),
      });

      if (response.ok) {
        setFeedbackMessage('Permissions updated successfully');
        fetchUsers(activeTab);
        closePermissionsModal();
      } else {
        setFeedbackMessage('Failed to update permissions');
      }
    } catch (error) {
      setFeedbackMessage('An error occurred while updating permissions');
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setCategory(user.category || 'student');
    setCustomPermissions(user.permissions || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openPermissionsModal = (user) => {
    setViewPermissionsUser(user);
    setCustomPermissions(user.permissions || {});
  };

  const closePermissionsModal = () => {
    setViewPermissionsUser(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8" />
              <h1 className="text-2xl font-semibold">User Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className={`pl-10 pr-4 py-2 ${
                    isDarkMode 
                      ? 'bg-gray-900 border-gray-800 focus:ring-gray-700' 
                      : 'bg-gray-100 border-gray-200 focus:ring-gray-300'
                  } border rounded-lg focus:outline-none focus:ring-2 w-64`}
                />
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Now scrollable on mobile */}
      <div className="px-4 md:px-8 py-4 border-b border-gray-800 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {['all', 'pending', 'done', 'ec', 'admin', 'students', 'instructors', 'others'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="p-4 md:p-8">
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.email}
                className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{user.email}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800">
                              {user.status}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800">
                              {user.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {!user.approved && (
                        <button
                          onClick={() => openModal(user)}
                          className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleBlock(user.email)}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Block
                      </button>
                      <button
                        onClick={() => openPermissionsModal(user)}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Permissions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-300">No users found</h3>
              <p className="text-gray-400 mt-1">
                {searchQuery ? 'Try adjusting your search' : 'Select a tab to fetch users'}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Modals remain the same but with updated theme classes */}

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-900 rounded-xl border border-gray-800 w-[480px] max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Approve User</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    <option value="student">Student</option>
                    <option value="EC">EC</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Custom Permissions</label>
                  <div className="space-y-3">
                    {Object.entries(customPermissions).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setCustomPermissions({
                              ...customPermissions,
                              [key]: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded border-gray-700 text-white focus:ring-offset-gray-900"
                        />
                        <span className="ml-3 text-sm">{key}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApprove(selectedUser.email)}
                    className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewPermissionsUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-900 rounded-xl border border-gray-800 w-[480px] max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Edit Permissions</h2>
                <button onClick={closePermissionsModal} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(customPermissions).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setCustomPermissions({
                            ...customPermissions,
                            [key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-700 text-white focus:ring-offset-gray-900"
                      />
                      <span className="ml-3 text-sm">{key}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={closePermissionsModal}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdatePermissions(viewPermissionsUser.email)}
                    className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
{/* Feedback Toast */}
{feedbackMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}