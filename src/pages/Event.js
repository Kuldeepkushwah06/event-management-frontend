import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

function Event() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = localStorage.getItem('token');

  const fetchEvent = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvent(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching event');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleAttend = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/events/${id}/attend`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchEvent();
    } catch (err) {
      setError(err.response?.data?.message || 'Error attending event');
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/events/${id}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting event');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  const isCreator = currentUser && event.creator._id === currentUser._id;
  const isAttending = currentUser && event.attendees.some(attendee => attendee._id === currentUser._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {event.imageUrl && (
          <div className="w-full h-96">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {event.title}
            </h3>
            <div className="space-x-3">
              {isCreator ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              ) : isAuthenticated && !isAttending && !isCreator ? (
                <button
                  onClick={handleAttend}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  disabled={event.attendees.length >= event.maxAttendees}
                >
                  {event.attendees.length >= event.maxAttendees ? 'Event Full' : 'Attend Event'}
                </button>
              ) : isAttending && (
                <span className="inline-flex items-center px-4 py-2 border border-green-500 text-sm font-medium rounded-md text-green-700 bg-green-50">
                  Attending
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(event.date), 'MMMM d, yyyy')}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Time</dt>
              <dd className="mt-1 text-sm text-gray-900">{event.time}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{event.location}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{event.category}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{event.description}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Attendees ({event.attendees.length}/{event.maxAttendees})
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {event.attendees.map(attendee => attendee.name).join(', ')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Event; 