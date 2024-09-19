// src/pages/ConnectPage.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from '../axios'; // Axios instance with base URL set
import Wrapper from '../components/Wrapper';
import GroupCard from '../connectPage/GroupCard';
import CreateGroupForm from '../connectPage/CreateGroupForm';
import Sidebar from '../connectPage/Sidebar';
import AlumniList from '../connectPage/AlumniList';
import { navigation } from '../connectPage/navigation';
import Messenger from '../pages/messenger/messenger';

const ConnectPage = () => {
  const [activeTab, setActiveTab] = useState('Explore connections');
  const [exploreData, setExploreData] = useState([]);
  const [alumniData, setAlumniData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [connections, setConnections] = useState([]);
  const [connectionRequestsSent, setConnectionRequestsSent] = useState([]);
  const [connectionRequestsReceived, setConnectionRequestsReceived] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/api/users/connections', config);
        setConnections(data.connections);
        setConnectionRequestsSent(data.connectionRequestsSent);
        setConnectionRequestsReceived(data.connectionRequestsReceived);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchExploreData = async () => {
      try {
        const { data } = await axios.get('/api/users/explore-connect', config);
        setExploreData(data);
      } catch (error) {
        console.error('Error fetching explore data:', error);
      }
    };

    const fetchAlumniData = async () => {
      try {
        const { data } = await axios.get('/api/users/alumni-connect', config);
        setAlumniData(data);
      } catch (error) {
        console.error('Error fetching alumni data:', error);
      }
    };

    const fetchStudentData = async () => {
      try {
        const { data } = await axios.get('/api/users/students-connect', config);
        setStudentsData(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchUserData();
    fetchExploreData();
    fetchAlumniData();
    fetchStudentData();
  }, [config]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleCreateGroup = (groupData) => {
    setGroups(prevGroups => [...prevGroups, groupData]);
  };

  const handleJoinGroup = (group) => {
    setJoinedGroups(prevGroups => [...prevGroups, group]);
  };

  const handleSendConnectionRequest = async (alumnus) => {
    try {
      await axios.put(`/api/users/connect/request/${alumnus._id}`, {}, config);
      setExploreData(prevData => prevData.filter(user => user._id !== alumnus._id));
      setAlumniData(prevData => prevData.filter(user => user._id !== alumnus._id));
      setStudentsData(prevData => prevData.filter(user => user._id !== alumnus._id));
      setConnectionRequestsSent(prevRequests => [...prevRequests, alumnus]);
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const handleAcceptConnectionRequest = async (alumnus) => {
    try {
      await axios.put(`/api/users/connect/accept/${alumnus._id}`, {}, config);
      setConnections(prevConnections => [...prevConnections, alumnus]);
      setConnectionRequestsReceived(prevRequests =>
        prevRequests.filter(request => request._id !== alumnus._id)
      );
    } catch (error) {
      console.error('Error accepting connection request:', error);
    }
  };

  const handleCancelConnectionRequest = async (alumnus) => {
    try {
      await axios.put(`/api/users/connect/cancel/${alumnus._id}`, {}, config);
      setExploreData(prevData => [...prevData, alumnus]);
      setAlumniData(prevData => [...prevData, alumnus]);
      setStudentsData(prevData => [...prevData, alumnus]);
      setConnectionRequestsSent(prevRequests =>
        prevRequests.filter(request => request._id !== alumnus._id)
      );
    } catch (error) {
      console.error('Error canceling connection request:', error);
    }
  };

  const handleDeclineConnectionRequest = async (alumnus) => {
    try {
      await axios.put(`/api/users/connect/decline/${alumnus._id}`, {}, config);
      setExploreData(prevData => [...prevData, alumnus]);
      setAlumniData(prevData => [...prevData, alumnus]);
      setStudentsData(prevData => [...prevData, alumnus]);
      setConnectionRequestsReceived(prevRequests =>
        prevRequests.filter(request => request._id !== alumnus._id)
      );
    } catch (error) {
      console.error('Error declining connection request:', error);
    }
  };

  // Filter connections based on the search term
  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Wrapper>
      <Sidebar
        navigation={navigation}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        sentRequestsCount={connectionRequestsSent.length}
        receivedRequestsCount={connectionRequestsReceived.length}
      />
      {!(activeTab === 'Messaging') ? (
        <div className="w-[80%] max-sm:w-[100%] p-8 max-sm:p-4">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">{activeTab}</h1>

          {/* Search Input */}
          <div className="relative">
            {(activeTab === 'Alumni Connections' || activeTab === 'Students Connections' || activeTab === 'My connections' || activeTab === 'Explore connections') && (
              <input
                type="text"
                placeholder="Search connections"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="relative mb-4 px-4 py-2 border rounded-lg w-full"
              />
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute right-5 top-1/2 transform -translate-y-[80%] text-gray-500'
              >
                Clear
              </button>
            )}
          </div>

          {activeTab === 'My Groups' && (
            <div>
              <button
                onClick={() => setShowCreateGroupForm(true)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Create Group
              </button>
              <ul className="flex flex-wrap">
                {joinedGroups.map((group, index) => (
                  <li key={index} className="m-2">
                    <GroupCard group={group} onJoin={handleJoinGroup} isJoined={true} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'Explore connections' && (
            <AlumniList
              alumni={exploreData.filter(alumnus =>
                alumnus.name.toLowerCase().includes(searchTerm.toLowerCase())
              )} // Filtered data
              isConnectedTab={false}
              onSendRequest={handleSendConnectionRequest}
            />
          )}

          {activeTab === 'My connections' && (
            <AlumniList
              alumni={filteredConnections} // Use filtered connections
              isConnectedTab={true}
            />
          )}

          {/* Additional tabs like Sent, Received can be handled similarly */}

          {activeTab === 'Alumni Connections' && (
            <AlumniList
              alumni={alumniData.filter(alumnus =>
                alumnus.name.toLowerCase().includes(searchTerm.toLowerCase())
              )} // Use filtered data
              isConnectedTab={false}
              onSendRequest={handleSendConnectionRequest}
            />
          )}
          {activeTab === 'Students Connections' && (
            <AlumniList
              alumni={studentsData.filter(alumnus =>
                alumnus.name.toLowerCase().includes(searchTerm.toLowerCase())
              )} // Use filtered data
              isConnectedTab={false}
              onSendRequest={handleSendConnectionRequest}
            />
          )}

          {activeTab === 'Sent' && (
            <AlumniList
              alumni={connectionRequestsSent || []} // Use fetched connection requests sent
              isConnectedTab={false}
              requestSent={true}
              // onSendRequest={handleSendConnectionRequest}
              // onAcceptRequest={handleAcceptConnectionRequest}
              onCancelRequest={handleCancelConnectionRequest}
            // onDeclineRequest={handleDeclineConnectionRequest}
            />
          )}
          {activeTab === 'Received' && (
            <AlumniList
              alumni={connectionRequestsReceived || []} // Use fetched connection requests received
              isConnectedTab={false}
              isRequestReceived={true}
              // onSendRequest={handleSendConnectionRequest}
              onAcceptRequest={handleAcceptConnectionRequest}
              // onCancelRequest={handleCancelConnectionRequest}
              onDeclineRequest={handleDeclineConnectionRequest}
            />
          )}

          {activeTab === 'Explore Groups' && (
            <div>
              <ul className="flex flex-wrap">
                {groups.map((group, index) => (
                  <li key={index} className="m-2">
                    <GroupCard group={group} onJoin={handleJoinGroup} isJoined={joinedGroups.includes(group)} />
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      ) : (
        <div className="w-[80%] h-[70vh] p-8 py-0">
          <Messenger />
        </div>
      )}
      {showCreateGroupForm && <CreateGroupForm onCreateGroup={handleCreateGroup} onClose={() => setShowCreateGroupForm(false)} />}
    </Wrapper>
  );
};

export default ConnectPage;
