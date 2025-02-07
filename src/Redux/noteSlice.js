
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addNote: (state, action) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action) => {
      const index = state.notes.findIndex(note => note.documentId === action.payload.documentId);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.documentId !== action.payload);
    }
  },
});

export const { setNotes, setLoading, setError, addNote, updateNote, deleteNote } = noteSlice.actions;

// Fetch Notes
export const fetchNotes = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch('http://localhost:8080/getdata');
    const data = await response.json();
    dispatch(setNotes(data));
  } catch (err) {
    dispatch(setError('Failed to load notes'));
  } finally {
    dispatch(setLoading(false)); // Set loading to false
  }
};

// Add New Note
export const addNewNote = (note) => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:8080/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });

    const data = await response.json();
    
    console.log("✅ New note added:", data); // Debugging
    dispatch(addNote({ ...data, documentId: data.documentId })); // Ensure documentId is set
  } catch (err) {
    dispatch(setError('Failed to add note'));
  }
};


// Update Note
export const updateNoteInDB = (note) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:8080/update/${note.documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: note.title, content: note.content }),
    });
    const result = await response.json();
    if (response.ok) {
      dispatch(updateNote(note)); // Update directly from local state
    } else {
      dispatch(setError('Failed to update note'));
    }
  } catch (err) {
    dispatch(setError('Failed to update note'));
  }
};

// Delete Note
export const deleteNoteFromDB = (documentId) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:8080/delete/${documentId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(deleteNote(documentId));
    } else {
      console.error('Delete failed:', await response.json());
    }
  } catch (err) {
    console.error('Error deleting note:', err);
  }
};
export default noteSlice.reducer;
