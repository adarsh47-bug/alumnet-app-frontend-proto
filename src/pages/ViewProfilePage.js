import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { AuthContext } from '../context/authContext';

const ProfileSection = ({ id, title, img = undefined, content, isList = false, itemFormat }) => (
  <article id={id} className="w-full rounded-xl border border-gray-300 bg-[#fff2f238] text-black p-6 m-3 shadow-lg">
    <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>
    {isList ? (
      content.length > 0 ? (
        <ul className="list-disc list-inside text-black">
          {content.map((item, index) => (
            <li key={index}>{itemFormat ? itemFormat(item) : item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-black">No {title.toLowerCase()} listed.</p>
      )
    ) : (
      content.map(({ label, value }, index) => (
        <p key={index} className="text-black">
          <strong>{label}:</strong> {value}
        </p>
      ))
    )}

    {img &&
      (<div className="flex flex-wrap items-center justify-center gap-4">
        <span className='px-4 py-3 hover:bg-slate-200 rounded-full text-4xl text-gray-500'>&larr;</span>
        {img?.map(url => <img src={url} alt="line" className="w-[40%] mt-4" />)}
        <span className='px-4 py-3 hover:bg-slate-200 rounded-full text-4xl text-gray-500'>&rarr;</span>
      </div>)
    }
  </article>
);

const ViewProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [connectionRequestsSent, setConnectionRequestsSent] = useState([]);
  // const navigate = useNavigate();
  const user = useContext(AuthContext);
  // const currentId = user.user._id;

  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/users/profile/${userId}`, config);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      setLoading(false);
    };

    const fetchUserConnections = async () => {
      try {
        const { data } = await axios.get('/api/users/connections', config);
        setConnections(data.connections);
        setConnectionRequestsSent(data.connectionRequestsSent);
      } catch (error) {
        console.error('Error fetching user connections:', error);
      }
    };

    fetchProfile();
    fetchUserConnections();
  }, [userId]);

  // const handleClick = async (user) => {
  //   try {
  //     const res = await axios.get(`/api/conversations/find/${currentId}/${user._id}`);
  //     if (!res.data) {
  //       const newConversation = await axios.post("/api/conversations/", {
  //         senderId: currentId,
  //         receiverId: user._id,
  //       });
  //       navigate(`/messenger`, { state: { currentChat: newConversation.data } });
  //     } else {
  //       navigate(`/messenger`, { state: { currentChat: res.data } });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSendConnectionRequest = async (user) => {
    try {
      await axios.put(`/api/users/connect/request/${user._id}`, {}, config);
      setConnectionRequestsSent((prevRequests) => [...prevRequests, user]);
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const handleCancelConnectionRequest = async (user) => {
    try {
      await axios.put(`/api/users/connect/cancel/${user._id}`, {}, config);
      setConnectionRequestsSent((prevRequests) =>
        prevRequests.filter((request) => request._id !== user._id)
      );
    } catch (error) {
      console.error('Error canceling connection request:', error);
    }
  };

  if (loading) {
    return (
      <div aria-label="Loading..." role="status" className="flex justify-center items-center space-x-2 w-[100vw] h-[100vh]">
        <svg className="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
          <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
        </svg>
        <span className="text-4xl font-medium text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!profile) return <p>No profile found</p>;

  const isConnected = connections.some((connection) => connection._id === userId);
  const isRequestSent = connectionRequestsSent.some((request) => request._id === userId);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex max-sm:flex-col items-center gap-6 mb-6">
          <div className="flex items-center gap-6">
            <img
              src={profile.profileImg}
              alt={`${profile.name}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-500">{profile?.experience?.length === 0 ? 'No specified' : `${profile?.experience[0]?.position} at ${profile?.experience[0]?.company}`}</p>
            </div>
          </div>
          {isConnected ? (
            <button
              // onClick={() => handleClick(profile)}
              onClick={alert("Currently in construction state.")}
              className="mt-4 px-4 py-2 m-4 bg-green-500 text-white rounded-lg"
            >
              Message
            </button>
          ) : isRequestSent ? (
            <button
              onClick={() => handleCancelConnectionRequest(profile)}
              className="mt-4 px-4 py-2 m-4 bg-red-500 text-white rounded-lg"
            >
              Cancel Request
            </button>
          ) : (
            <button
              onClick={() => handleSendConnectionRequest(profile)}
              className="mt-4 px-4 py-2 m-4 bg-blue-500 text-white rounded-lg"
            >
              Connect with {profile.name.split(' ')[0]}
            </button>
          )}
        </div>
        <ProfileSection
          id="basic-details"
          title="Basic Details"
          content={[
            { label: 'Name', value: profile.name },
            { label: 'Email', value: profile.email.length === 0 ? 'No specified' : profile.email },
            { label: 'Contact Number', value: profile.contactNumber || 'No specified' },
            { label: 'Bio', value: profile.bio || 'No specified' },
            { label: 'Type', value: profile.type || 'No specified' },
            { label: 'University', value: profile.education?.[0]?.University || 'No institution listed' },
            { label: 'Account Created', value: new Date(profile.createdAt || Date.now()).toLocaleDateString() },
            { label: 'Last Updated', value: new Date(profile.updatedAt || Date.now()).toLocaleDateString() },
          ]}
        />
        <ProfileSection
          id="skills"
          title="Skills"
          content={profile.skills.length === 0 ? ['No specified'] : profile.skills}
          isList={true}
        />
        <ProfileSection
          id="areas-of-interest"
          title="Areas of Interest"
          content={profile.areasOfInterest.length === 0 ? ['No specified'] : profile.areasOfInterest}
          isList={true}
        />
        <ProfileSection
          id="education"
          title="Education"
          img={profile.education?.[0]?.images}
          content={profile.education.length === 0 ? ['No specified'] : profile.education.map(edu => `${edu.degree} at ${edu.institution}`)}
          isList={true}
        />
        <ProfileSection
          id="experience"
          title="Experience"
          content={profile.experience.length === 0 ? ['No specified'] : profile.experience.map(exp => `${exp.position} at ${exp.company}`)}
          isList={true}
        />
        <ProfileSection
          id="projects"
          title="Projects"
          content={profile.projects.length === 0 ? ['No specified'] : profile.projects}
          isList={true}
        />
        <ProfileSection
          id="certifications"
          title="Certifications"
          content={profile.certifications.length === 0 ? ['No specified'] : profile.certifications}
          isList={true}
        />
        <ProfileSection
          id="volunteer-experience"
          title="Volunteer Experience"
          content={profile.volunteerExperience.length === 0 ? ['No specified'] : profile.volunteerExperience}
          isList={true}
        />
        <ProfileSection
          id="honors-awards"
          title="Honors & Awards"
          content={profile.honorsAwards.length === 0 ? ['No specified'] : profile.honorsAwards}
          isList={true}
        />
        <ProfileSection
          id="languages"
          title="Languages"
          content={profile.languages.length === 0 ? ['No specified'] : profile.languages}
          isList={true}
        />
        <ProfileSection
          id="organizations"
          title="Organizations"
          content={profile.organizations.length === 0 ? ['No specified'] : profile.organizations}
          isList={true}
        />
      </div>
    </div>
  );
};

export default ViewProfilePage;