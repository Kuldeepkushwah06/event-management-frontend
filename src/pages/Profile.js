import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
        Error: {error}
      </div>
    </div>
  );
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and events.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
            
            {/* Created Events */}
            <div className="bg-gray-50 px-4 py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 mb-4">Created Events</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.createdEvents?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {user.createdEvents.map(event => (
                      <div key={event._id} className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No events created yet</p>
                )}
              </dd>
            </div>

            {/* Attending Events */}
            <div className="bg-white px-4 py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 mb-4">Attending Events</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.attendingEvents?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {user.attendingEvents.map(event => (
                      <div key={event._id} className="bg-gray-50 p-4 rounded-lg shadow">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Not attending any events yet</p>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Profile; 