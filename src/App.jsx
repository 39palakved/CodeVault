// App.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, addNewNote, updateNoteInDB, deleteNoteFromDB } from "./Redux/noteSlice";

const App = () => {
  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state) => state.note);
  const [newNote, setNewNote] = useState({ documentId: "", title: "", content: "" });
  const [editNote, setEditNote] = useState(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.title && newNote.content) {
      dispatch(addNewNote(newNote));
      setNewNote({ documentId: "", title: "", content: "" });
    }
  };

  const handleUpdateNote = (e) => {
    e.preventDefault();
    if (editNote) {
      dispatch(updateNoteInDB(editNote));
      setEditNote(null);
    }
  };

  const handleDeleteNote = (id) => {
    dispatch(deleteNoteFromDB(id));
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-3xl font-bold">Snippet Collection </h2>
        <div className="mt-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            onClick={() => setEditNote({ title: "", content: "" })}
          >
            Add New Snippet
          </button>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold">Your Snippet Collection</h3>
          <ul className="mt-2">
            {notes.map((note) => (
              <li key={note.documentId} className="text-white py-2">
                <button
                  className="w-full text-left px-2 hover:bg-gray-700 rounded"
                  onClick={() => setEditNote(note)}
                >
                  {note.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Code Snippet Vault</h2>

        {/* New/Edit Note Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">
            {editNote ? "Edit Note" : "Add New Snippet"}
          </h3>
          <form onSubmit={editNote ? handleUpdateNote : handleAddNote}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Title</label>
              <input
                type="text"
                value={editNote ? editNote.title : newNote.title}
                onChange={(e) =>
                  editNote
                    ? setEditNote({ ...editNote, title: e.target.value })
                    : setNewNote({ ...newNote, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Content</label>
              <textarea
                rows="6"
                value={editNote ? editNote.content : newNote.content}
                onChange={(e) =>
                  editNote
                    ? setEditNote({ ...editNote, content: e.target.value })
                    : setNewNote({ ...newNote, content: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {editNote ? "Update Note" : "Add Note"}
            </button>
          </form>
        </div>

        {/* List of Notes */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Code Repository</h3>
          <ul>
            {notes.map((note) => (
              <li key={note.documentId} className="bg-white p-4 mb-4 rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold">{note.title}</h4>
                <p>{note.content}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                    onClick={() => setEditNote(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    onClick={() => handleDeleteNote(note.documentId)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
