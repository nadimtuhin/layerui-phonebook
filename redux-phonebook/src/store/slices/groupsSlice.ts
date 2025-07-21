import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContactGroup } from '@/types';
import { groupsApi } from '@/services/api';

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async () => {
    const response = await groupsApi.getGroups();
    return response.data;
  }
);

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (group: Omit<ContactGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await groupsApi.createGroup(group);
    return response.data;
  }
);

export const updateGroup = createAsyncThunk(
  'groups/updateGroup',
  async ({ id, ...updates }: Partial<ContactGroup> & { id: string }) => {
    const response = await groupsApi.updateGroup(id, updates);
    return response.data;
  }
);

export const deleteGroup = createAsyncThunk(
  'groups/deleteGroup',
  async (groupId: string) => {
    await groupsApi.deleteGroup(groupId);
    return groupId;
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: {} as Record<string, ContactGroup>,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload.reduce((acc, group) => {
          acc[group.id] = group;
          return acc;
        }, {} as Record<string, ContactGroup>);
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch groups';
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups[action.payload.id] = action.payload;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.groups[action.payload.id] = action.payload;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        delete state.groups[action.payload];
      });
  },
});

export const { clearError } = groupsSlice.actions;
export default groupsSlice.reducer;