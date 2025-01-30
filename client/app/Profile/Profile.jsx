"use client";
import { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndStatus = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/getuser');
        const userData = await userResponse.json();
         setUser(userData);
        console.log(userData.email);
        // Fetch status using the fetched user email
        const statusResponse = await fetch('http://localhost:3000/api/userStatus/getUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'email': `"${userData.email}"`
          }
        });
        let statusData = await statusResponse.json();
        setStatus(statusData.approved);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-900">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Error loading profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user.given_name?.[0]}{user.family_name?.[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.given_name} {user.family_name}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                ID: {user.id.slice(0, 8)}...
              </span>
              <span className={`mt-2 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {status ? 'Approved' : 'Requested'}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6 border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500 mb-1">First Name</h3>
                <p className="text-lg font-medium text-gray-900">{user.given_name}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Name</h3>
                <p className="text-lg font-medium text-gray-900">{user.family_name}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
         
        </div>
      </div>
    </div>
  );
};

export default Profile;