import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  CalendarIcon,
  LocationMarkerIcon,
  UserGroupIcon,
  ShareIcon,
  PencilAltIcon,
  TrashIcon,
  UserIcon,
  ChatAlt2Icon
} from '@heroicons/react/outline';

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = localStorage.getItem('token');
  const isCreator = currentUser && event?.creator?._id === currentUser._id;
  const isAttending = currentUser && event?.attendees?.some(attendee => attendee?._id === currentUser._id);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/public/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setEvent(response.data);
      setComments(response.data.comments || []);
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/events/${id}/attend`);
      fetchEvent();
    } catch (err) {
      setError(err.response?.data?.message || 'Error attending event');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/events');
      } catch (err) {
        setError('Error deleting event');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/events/${id}/comments`, { content: comment });
      setComment('');
      fetchEvent();
    } catch (err) {
      setError('Error posting comment');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
          {error || 'Event not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {event.imageUrl && (
          <div className="relative h-72 w-full">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl font-bold">{event.title}</h1>
              <div className="mt-2 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>Organized by {event.creator?.name || 'Unknown'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Event Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Login to Attend
                </Link>
              ) : !isCreator && !isAttending && (
                <button
                  onClick={handleAttend}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  disabled={event.attendees?.length >= event.maxAttendees}
                >
                  {event.attendees?.length >= event.maxAttendees ? 'Event Full' : 'Attend Event'}
                </button>
              )}
              {isAttending && (
                <span className="inline-flex items-center px-4 py-2 border border-green-500 text-sm font-medium rounded-md text-green-700 bg-green-50">
                  Attending
                </span>
              )}
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Share
              </button>
            </div>
            {isCreator && (
              <div className="flex space-x-4">
                <Link
                  to={`/events/${id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilAltIcon className="h-5 w-5 mr-2" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Comments</h3>
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <ChatAlt2Icon className="h-5 w-5 mr-2" />
                      Post
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {comments?.map((comment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {comment.user?.name?.charAt(0) || '?'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{comment.user?.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Event Info Card */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Event Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date & Time</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <LocationMarkerIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Attendees</p>
                      <p className="text-sm text-gray-500">
                        {event.attendees?.length} / {event.maxAttendees} spots filled
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendees List */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Attendees</h3>
                <div className="space-y-3">
                  {event.attendees?.map((attendee) => (
                    <div key={attendee._id} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {attendee?.name?.charAt(0) || '?'}
                      </div>
                      <span className="ml-3 text-sm text-gray-900">{attendee?.name || 'Anonymous'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
          Link copied to clipboard!
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
          {event.category}
        </span>
        {isCreator && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Your Event
          </span>
        )}
        {isAttending && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Attending
          </span>
        )}
      </div>

      {/* <div className="space-x-3">
        {!isAuthenticated ? (
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Login to Attend
          </Link>
        ) : isCreator ? (
          <>
            <Link to={`/events/${id}/edit`}>Edit</Link>
            <button onClick={handleDelete}>Delete</button>
          </>
        ) : !isAttending ? (
          <button onClick={handleAttend}>Attend Event</button>
        ) : (
          <span>Attending</span>
        )}
      </div> */}
    </div>
  );
}

export default EventDetails; 