import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostViewIcon = ({ postId, userId }) => {
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        // Fetch initial view count
        const fetchViewCount = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/views/${postId}`);
                setViewCount(response.data.length); // Set the view count to the number of views
            } catch (error) {
                console.error('Error fetching view count:', error);
            }
        };

        // Increase view count on load
        const increaseViewCount = async () => {
            try {
                await axios.post('/views/increase', { userId, postId });
                fetchViewCount(); // Update the view count after increasing
            } catch (error) {
                console.error('Error increasing view count:', error);
            }
        };

        fetchViewCount();
        increaseViewCount();
    }, [postId, userId]);

    return (
        <div style={styles.viewIconContainer}>
            <i className="fa fa-eye" style={styles.icon}></i> {/* FontAwesome eye icon for views */}
            <span>{viewCount}</span>
        </div>
    );
};

// Inline styles
const styles = {
    viewIconContainer: {
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        display: 'flex',
        alignItems: 'center',
        color: '#666',
    },
    icon: {
        marginRight: '5px',
    },
};

export default PostViewIcon;
