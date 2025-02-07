import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CalendarIcon, LocationMarkerIcon, UserGroupIcon, FilterIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, created, attending
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (err) {
      setError('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = (events) => {
    return events.filter(event => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = category === 'all' || event.category === category;

      // Event type filter (all, created, attending)
      const matchesEventType = filter === 'all' || 
        (filter === 'created' && event.creator._id === JSON.parse(localStorage.getItem('user'))._id) ||
        (filter === 'attending' && event.attendees.some(attendee => 
          attendee._id === JSON.parse(localStorage.getItem('user'))._id
        ));

      // Date filter
      const eventDate = new Date(event.date);
      const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      const matchesDate = (!start || eventDate >= start) && (!end || eventDate <= end);

      return matchesSearch && matchesCategory && matchesEventType && matchesDate;
    });
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setFilter('all');
    setDateFilter({
      startDate: '',
      endDate: ''
    });
  };

  const filteredEvents = filterEvents(events);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Manage and discover events</p>
        </div>
        <Link
          to="/events/create"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Event
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Events</option>
                <option value="created">Created by me</option>
                <option value="attending">Attending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Events by Date</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
            <span className="text-sm text-gray-500">
              Showing {filteredEvents.length} events
            </span>
          </div>
        </div>
      </div>

      {/* Update the Clear Filters button section */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          Showing {filteredEvents.length} of {events.length} events
        </span>
        <button
          onClick={clearFilters}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          Clear All Filters
        </button>
      </div>

      {/* Events Grid */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {event.imageUrl && (
                <div className="relative h-48">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 mt-2 mr-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.category === 'conference' ? 'bg-purple-100 text-purple-800' :
                      event.category === 'workshop' ? 'bg-blue-100 text-blue-800' :
                      event.category === 'social' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <LocationMarkerIcon className="h-5 w-5 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    {event.attendees.length} / {event.maxAttendees} attendees
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <Link
                    to={`/events/${event._id}`}
                    className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                  >
                    View Details
                  </Link>
                  {event.isCreator && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Created by you
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state message update */}
      {filteredEvents.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || category !== 'all' || filter !== 'all' || dateFilter.startDate || dateFilter.endDate
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating a new event'}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Active filters:
            <ul className="mt-2">
              {searchTerm && <li>• Search term: "{searchTerm}"</li>}
              {category !== 'all' && <li>• Category: {category}</li>}
              {filter !== 'all' && (
                <li>• Showing: {filter === 'created' ? 'Created by me' : 'Attending'}</li>
              )}
              {dateFilter.startDate && (
                <li>• From: {new Date(dateFilter.startDate).toLocaleDateString()}</li>
              )}
              {dateFilter.endDate && (
                <li>• To: {new Date(dateFilter.endDate).toLocaleDateString()}</li>
              )}
            </ul>
          </div>
          <div className="mt-6">
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
            >
              Clear Filters
            </button>
            <Link
              to="/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Event
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 