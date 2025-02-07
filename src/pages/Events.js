import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/public`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setEvents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = localStorage.getItem('token');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        {isAuthenticated ? (
          <Link
            to="/events/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Event
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Login to Create Event
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event._id}
            to={`/events/${event._id}`}
            className="block hover:shadow-lg transition-shadow duration-200"
          >
            <div className="bg-white overflow-hidden shadow rounded-lg">
              {event.imageUrl && (
                <div className="h-48 w-full">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                </p>
                <p className="mt-2 text-sm text-gray-500">{event.location}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {event.category}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {event.attendees.length}/{event.maxAttendees} attending
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Events; 