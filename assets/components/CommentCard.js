import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import commentstyles from '../../stylesheets/commentstyles';
import mapstyles from '../../stylesheets/mapstyles';
import { db, auth } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

export const handleCommentSubmit = async (
  selectedMarkerId,
  commentDescription,
  setCommentDescription,
  setComments
) => {
  let username = 'Unknown';

  const userId = auth.currentUser.uid;
  if (userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        username = userSnap.data().username || 'Unknown';
      }
    } catch (userError) {
      console.error('Error fetching username:', userError);
    }
  }

  if (!selectedMarkerId || !commentDescription.trim()) return;

  try {
    const commentsRef = collection(db, 'pins', selectedMarkerId, 'comments');
    await addDoc(commentsRef, {
      user_id: auth.currentUser.uid,
      username: username,
      description: commentDescription,
      timestamp: new Date(),
      score: 0,
    });
    setCommentDescription('');
    loadComments(selectedMarkerId, setComments);
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

export const loadComments = async (markerId, setComments) => {
  try {
    const commentsRef = collection(db, 'pins', markerId, 'comments');
    const querySnapshot = await getDocs(commentsRef);
    const commentsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setComments(commentsList);
  } catch (error) {
    console.error('Error loading comments:', error);
  }
};

export const loadCommentVotes = async setCommentVotes => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const commentVotesRef = doc(db, 'userVotes', userId);
    const commentVotesDoc = await getDoc(commentVotesRef);

    if (commentVotesDoc.exists()) {
      const votes = commentVotesDoc.data().votes || {};
      setCommentVotes(votes);
    }
  } catch (error) {
    console.error('Error loading comment votes:', error);
  }
};

export const handleCommentVote = async (
  markerId,
  commentId,
  voteType,
  comments,
  setComments,
  commentVotes,
  setCommentVotes
) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to vote');
      return;
    }

    const previousVote = commentVotes[commentId];
    const currentComment = comments.find(c => c.id === commentId);
    let newScore = currentComment?.score || 0;

    if (previousVote === voteType) {
      newScore -= voteType;
      setCommentVotes(prev => {
        const newVotes = { ...prev };
        delete newVotes[commentId];
        return newVotes;
      });
    } else {
      if (previousVote) {
        newScore -= previousVote;
      }
      newScore += voteType;
      setCommentVotes(prev => ({
        ...prev,
        [commentId]: voteType,
      }));
    }

    const updateCommentList = prevComments =>
      prevComments.map(c => (c.id === commentId ? { ...c, score: newScore } : c));

    setComments(updateCommentList);

    const commentRef = doc(db, 'pins', markerId, 'comments', commentId);
    await updateDoc(commentRef, {
      score: newScore,
    });
  } catch (error) {
    console.error('Error updating vote:', error);
    Alert.alert('Error', 'Failed to update vote');
    loadComments(markerId, setComments);
  }
};

export const deleteComment = async (markerId, commentId, comments, setComments) => {
  try {
    const commentRef = doc(db, 'pins', markerId, 'comments', commentId);
    await deleteDoc(commentRef);
    setComments(comments.filter(comment => comment.id !== commentId));
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};

const CommentCard = ({
  item,
  selectedMarkerId,
  comments,
  setComments,
  commentVotes,
  setCommentVotes,
  userId,
}) => {
  const handleDeleteComment = () => {
    deleteComment(selectedMarkerId, item.id, comments, setComments);
  };

  return (
    <View style={commentstyles.container}>
      <View style={commentstyles.innerContainer}>
        <View style={commentstyles.commentItem}>
          <View style={commentstyles.commentTextContainer}>
            <Text style={commentstyles.commentUsername}>{item.username}</Text>
            <Text style={commentstyles.commentDescription}>{item.description}</Text>
            <Text style={commentstyles.commentTimestamp}>
              {new Date(item.timestamp.toDate()).toLocaleString()}
            </Text>
          </View>

          <View style={commentstyles.commentVoteContainer}>
            <TouchableOpacity
              onPress={() =>
                handleCommentVote(
                  selectedMarkerId,
                  item.id,
                  1,
                  comments,
                  setComments,
                  commentVotes,
                  setCommentVotes
                )
              }
            >
              <Text
                style={[
                  mapstyles.voteButton,
                  commentVotes[item.id] === 1 && mapstyles.voteButtonActive,
                ]}
              >
                ▲
              </Text>
            </TouchableOpacity>
            <Text style={mapstyles.voteScore}>{item.score}</Text>
            <TouchableOpacity
              onPress={() =>
                handleCommentVote(
                  selectedMarkerId,
                  item.id,
                  -1,
                  comments,
                  setComments,
                  commentVotes,
                  setCommentVotes
                )
              }
            >
              <Text
                style={[
                  mapstyles.voteButton,
                  commentVotes[item.id] === -1 && mapstyles.voteButtonActive,
                ]}
              >
                ▼
              </Text>
            </TouchableOpacity>
            {item.userId === userId && (
              <TouchableOpacity onPress={handleDeleteComment}>
                <Text style={commentstyles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommentCard;
