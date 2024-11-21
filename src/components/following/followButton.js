import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "./followingSheet.css";
import apiClient from "../../utilities/apiClient";

export default function FollowButton(props) {
	const routeChange = () => {
		navigate("/editUserPage");
	};

	const { onUpdateFollowerCount } = props;
	const [user, setUser] = useState([]);
	const [isFollowingBool, setIsFollowing] = useState();
	const params = useParams();
	const [followersState, setFollowers] = useState([]);
	let navigate = useNavigate();

	useEffect(() => {
		setUser(getUserInfo());
	}, []); // Get user's info

	const saveFollowNotification = async (actionUsername, username) => {
		const data = {
			type: "follow",
			username: username,
			actionUsername: actionUsername,
			text: `@${actionUsername} followed you.`,
		};

		if (data.username === data.actionUsername) return;

		try {
			await apiClient.post(`/notification`, data);
		} catch (error) {
			console.error("Error saving follow notification:", error);
		}
	};

	async function followUser() {
		try {
			const data = {
				userId: props.username,
				targetUserId: props.targetUserId,
			};

			const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/follow`;
			const res = await axios.post(url, data);

			if (res.status === 200) {
				setIsFollowing(true);

				const updatedFollowerCount = await fetchFollowerCount(
					props.targetUserId
				);
				onUpdateFollowerCount(updatedFollowerCount);
				saveFollowNotification(user.username, props.targetUserId);
			} else {
				throw new Error("Failed to follow the user");
			}
		} catch (error) {
			console.error("Error following the user:", error);
		}
	}

	async function unfollowUser() {
		try {
			const unFollow = {
				userId: props.username,
				targetUserId: props.targetUserId,
			};

			const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/unfollow`;
			const res = await axios.delete(url, { data: unFollow });

			if (res.status === 200) {
				setIsFollowing(false);

				// Update follower count
				const updatedFollowerCount = await fetchFollowerCount(
					props.targetUserId
				);
				onUpdateFollowerCount(updatedFollowerCount);
			} else {
				console.error("Failed to unfollow the user");
			}
		} catch (error) {
			console.error("Error unfollowing the user:", error);
		}
	}

	// This function is very important, it helps figure out which state the button should be in.
	useEffect(() => {
		async function isFollowing() {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${props.targetUserId}`
			);

			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			try {
				const fetchedFollowers = await response.json();

				setFollowers(fetchedFollowers[0].followers);

				if (followersState.find((x) => x === props.username)) {
					setIsFollowing(true); // Follow state, to true. Sets the button UI view.
				} else {
					setIsFollowing(false); // Follow state, to false. Sets the button UI view.
				}
			} catch (error) {
				console.log("User doesn't exist in follower's collection yet.");
				setIsFollowing(false); // Follow state, to false. Sets the button UI view.
			}
		}

		isFollowing();
		return;
	}, [followersState.length]);

	const fetchFollowerCount = async (targetUserId) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${targetUserId}`
			);
			return response.data[0]?.followers.length || 0;
		} catch (error) {
			console.error(`Error fetching follower count: ${error.message}`);
			return 0;
		}
	};

	function MainFollowButton() {
		const buttonStyles = {
			padding: "8px 16px",
			fontSize: "1rem",
			width: "auto",
			height: "auto",
			minWidth: "100px",
		};

		if (isFollowingBool) {
			return (
				<button
					className="ssu-button-primary"
					style={buttonStyles}
					id="unfollowButton"
					onClick={(e) => unfollowUser()}
				>
					<span className="message">Following</span>
				</button>
			);
		} else {
			return (
				<button
					className="ssu-button-primary"
					style={buttonStyles}
					id="followButton"
					onClick={(e) => followUser()}
				>
					Follow
				</button>
			);
		}
	}

	//if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

	// Returns the unfollow button or the follow button depending on the IsFollowing() state. Also shows an Edit Profile Button if the user is viewing their own profile.
	return (
		<div>
			{props.username !== props.targetUserId ? (
				<MainFollowButton />
			) : (
				<div></div>
			)}
		</div>
	);
}
