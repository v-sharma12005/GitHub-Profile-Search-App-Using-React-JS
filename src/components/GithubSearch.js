import React, { useState } from 'react'
import axios from 'axios';
import './GithubSearch.css';
import { FaMapMarkerAlt, FaGithub } from 'react-icons/fa'; 
import { PiBuildingsFill } from 'react-icons/pi';
import { FaXTwitter } from 'react-icons/fa6';

const GithubSearch = () => {

    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state add kiya

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Search shuru hote hi loading true
        setProfile(null);
        setError(null);

        // 2 seconds ka delay (hover/loading effect ke liye)
        setTimeout(async () => {
            try {
                const response = await axios.get(`https://api.github.com/users/${username}`);
                setProfile(response.data);
                setError(null);
            } catch(error) {
                setProfile(null);
                setError('User Not Found');
            } finally {
                setLoading(false); // Result aane ke baad loading false
            }
        }, 2000);
    };

    // Reset function saari states ko clear karne ke liye
    const handleReset = () => {
        setUsername('');
        setProfile(null);
        setError(null);
        setLoading(false);
    };

  return (
    <div className='main-container'>
      <h1 className='main-heading'>GitHub Profile Detective</h1>
      <form onSubmit={handleSubmit} className='search-form'>
        <input 
            type='text' 
            placeholder='Enter Github Username....' 
            value={username} 
            className='search-input' 
            onChange={(e) => setUsername(e.target.value)}
            required 
        />
        <button type='submit' className='search-btn' disabled={loading}>
            {loading ? '🔍...' : 'Search'} 
        </button>
        {/* Reset button tabhi dikhega jab username field me kuch likha ho */}
        {username && (
            <button type='button' className='reset-btn' onClick={handleReset}>
                Reset
            </button>
        )}
      </form>

      {/* Loading animation ya message */}
      {loading && <p className='loading-msg'>Hunting for profile details...</p>}
      
      {error && !loading && <p className='error-msg'>{error}</p>}
      
      {profile && !loading && (
        <div className='profile-container'>
            <div className='profile-content'>
                <div className='profile-img'>
                    <img src={profile.avatar_url} alt='Avatar' className='profile-avatar'></img>
                </div>
                <div className='profile-details'>

                    <div className='profile-des'>
                        <h2 className='profile-name'>{profile.name || "No Name"}</h2>
                        <p className='profile-created'>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>

                    <a href={profile.html_url} target='_blank' rel="noreferrer" className='profile-username'>@{profile.login}</a>
                    <p className='profile-bio'>{profile.bio || "This profile has no bio"}</p>

                    <div className='profile-stats'>
                        <p className='profile-repos'>Repositories<br/><span className='stats'>{profile.public_repos}</span></p>
                        <p className='profile-followers'>Followers<br/><span className='stats'>{profile.followers}</span></p>
                        <p className='profile-following'>Following<br/><span className='stats'>{profile.following}</span></p>
                    </div>

                    <div className='profile-info'>
                        <p className='profile-location'><FaMapMarkerAlt/> {profile.location || "Not Available"}</p>
                        <p className='profile-company'><PiBuildingsFill/> {profile.company || "Not Available"}</p>
                    </div>

                    <div className='profile-links'>
                        {profile.twitter_username && (
                            <a href={`https://twitter.com/${profile.twitter_username}`} target='_blank' rel="noreferrer" className='twitter-link'>
                                <FaXTwitter/> {profile.twitter_username}
                            </a>
                        )}
                        <a href={profile.html_url} target='_blank' rel="noreferrer" className='profile-url'><FaGithub/> View Profile</a>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default GithubSearch