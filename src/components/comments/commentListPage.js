import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import getUserInfo from "../../utilities/decodeJwt";
import socket from "../../utilities/socket";

export default function CommentList() {
	const [user, setUser] = useState({});
	const [comments, setComments] = useState([]);
	let location = useLocation();

	useEffect(() => {
		async function getRecords() {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/getCommentById/${location.state}`,
				{
					method: "GET",
				}
			);

			if (!response.ok) {
				const message = `An error occured: ${response.statusText}`;
				window.alert(message);
				return;
			}

			if (response != null) {
				const fetchedRecords = await response.json();
				setComments(fetchedRecords);
			}
		}

		getRecords();
		setUser(getUserInfo());

		socket.on("comment", (data) => {
			if (data.postId === location.state && data.type === "new") {
				setComments((prevComments) => [...prevComments, data.comment]);
			}
		});

		socket.on("deleteComment", (data) => {
			if (data.postId === location.state) {
				setComments((prevComments) =>
					prevComments.filter((c) => c._id !== data.commentId)
				);
			}
		});

		return () => {
			socket.off("comment");
			socket.off("deleteComment");
		};
	}, [location.state]);

	async function deleteComment(id) {
		await fetch(
			`${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/${id}`,
			{
				method: "DELETE",
			}
		);

		const newRecords = comments.filter((el) => el._id !== id);
		setComments(newRecords);

		socket.emit("deleteComment", { postId: location.state, commentId: id });
	}

	function commentList() {
		if (comments == null) {
			return (
				<div>
					<h3>No Comment Found</h3>
				</div>
			);
		}
		return comments.map((comment) => {
			return (
				<Card
					body
					outline
					color="success"
					className="mx-1 my-2"
					style={{ width: "30rem" }}
				>
					<Card.Body>
						<Stack>
							<div>
								<h4>{comment.commentContent}</h4>
							</div>
							<div>
								<Button
									variant="primary"
									className="mx-1 my-1"
									href={`/comments/editComment/${comment._id}`}
								>
									Edit
								</Button>

								<Button
									variant="primary"
									className="mx-1 my-1"
									onClick={() => deleteComment(comment._id)}
								>
									Delete
								</Button>
							</div>
						</Stack>
					</Card.Body>
				</Card>
			);
		});
	}
	if (!user)
		return (
			<div>
				<h3>
					You are not authorized to view this page, Please Login in{" "}
					<Link to={"/login"}>
						<a href="#">here</a>
					</Link>
				</h3>
			</div>
		);

	return (
		<div>
			<table className="table table-striped" style={{ marginTop: 20 }}>
				<tbody>{commentList()}</tbody>
			</table>
		</div>
	);
}
