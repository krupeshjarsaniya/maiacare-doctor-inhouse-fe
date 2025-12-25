// "use client";
// import { useEffect, useState } from "react";
// import {
//   getAllComments,
//   createComment,
//   updateComment,
//   deleteComment,
//   getCommentsById,
// } from "@/utils/apis/apiHelper";
// // 
// export default function CommentsPage() {
//   const [comments, setComments] = useState<any>([]);
//   const [userComment, setUserComment] = useState<any>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all on mount
//   useEffect(() => {
//     getAllComments()
//       .then((res) => setComments(res.data))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleSearch = async () => {
//     const res = await getCommentsById(1);
//     setUserComment(res.data);
//   }

//   const handleCreate = async () => {
//     const payload = {
//       postId: 110,
//       name: "Test User",
//       email: "test@example.com",
//       body: "This is a test comment",
//     };
//     const res = await createComment(payload);
//     setComments((prev: any) => [...prev, res.data]);
//   };

//   const handleUpdate = async (id: number) => {
//     const payload = {
//       postId: 1,
//       name: "Updated User",
//       email: "updated@example.com",
//       body: "Updated comment body",
//     };
//     const res = await updateComment(id, payload);
//     setComments((prev: any) => prev.map((c: any) => (c.id === id ? res.data : c)));
//   };

//   const handleDelete = async (id: number) => {
//     await deleteComment(id);
//     setComments((prev: any) => prev.filter((c: any) => c.id !== id));
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Comments</h1>
//       <button onClick={handleSearch}>Search Comment</button>
//       {userComment && <p className="border border-4 border-dark my-4 p-2">{userComment.comment}</p>}
//       <button onClick={handleCreate}>Create Comment</button>
//       <ul>
//         {comments.slice(0, 5).map((comment: any) => (
//           <li key={comment.id}>
//             <strong>{comment.postId}</strong> - {comment.userId}
//             <p>{comment.comment}</p>
//             <button onClick={() => handleUpdate(comment.id)}>Update</button>
//             <button onClick={() => handleDelete(comment.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export default function CommentsPage() { // remove this after component is ready
  return <div>Coming Soon...</div>; 
}
