# Track Manager App

A single-page application for managing music tracks, built with **React**, **TypeScript**, **MobX**, and **Ant Design**.

## 🔧 Getting Started

### Prerequisites
- Node.js **v20.13.1**

### Install dependencies
```bash
npm install
```

### Start the development server
```bash
npm run dev
```

> The app will be available at: `http://localhost:3000`

---

## ✅ Features

### Track Management
- View, create, edit and delete tracks
- Form validation for required fields (title, artist, album, cover image)
- Cover image URL with fallback preview
- Tag-based genre selection with autocomplete

### Audio Upload & Playback
- Upload `.mp3`, `.wav`, etc. to existing tracks
- File size validation (max 10MB)
- Remove uploaded audio file with confirmation
- Inline playback using `wavesurfer.js`
- One track plays at a time (auto pause others)

### List View
- Paginated track list with sorting and filtering
- Sort by title, artist, album, genre
- Filter by genre or artist
- Search by title/artist/album with debounce (500ms)
- Inline audio player with waveform visualization

### Bulk Operations
- Multi-select tracks with checkboxes
- Select all
- Bulk delete with confirmation

---

## Testability
- Unit Tests
- Full test coverage for TrackStore logic using Jest
- Covers: track creation, update, delete, bulk delete, file upload/remove, pagination-aware removeAllTracks
- All async methods tested with success and failure scenarios
- API calls fully mocked with jest.mock(...) for isolation
- Test file: src/__tests__/TrackStore.test.ts
- All key elements have `data-testid` attributes for E2E testing

| Category | Test IDs |
|---------|----------|
| **Core UI** | `tracks-header`, `create-track-button`, `search-input`, `pagination`, `pagination-next`, `pagination-prev` |
| **Track Items** | `track-item-{id}`, `track-item-{id}-title`, `track-item-{id}-artist`, `edit-track-{id}`, `delete-track-{id}` |
| **Form** | `track-form`, `input-title`, `input-artist`, `input-album`, `input-cover-image`, `genre-selector`, `submit-button` |
| **Validation** | `error-title`, `error-artist`, `error-album`, `error-coverImage` |
| **Notifications** | `toast-container`, `toast-success`, `toast-error` |
| **Dialogs** | `confirm-dialog`, `confirm-delete`, `cancel-delete` |
| **Audio Player** | `audio-player-{id}`, `play-button-{id}`, `pause-button-{id}`, `audio-progress-{id}`, `remove-audio-{id}`, `upload-track-{id}` |
| **Bulk** | `select-all`, `track-checkbox-{id}`, `bulk-delete-button` |

---

## ⚙️ Design Decisions

### 🔄 Sort-select control omitted
Sorting is handled through Ant Design Table headers. Adding a dropdown would duplicate this native functionality.

### ⛔ No select-mode toggle
Selection checkboxes are always visible (Ant Design default). An explicit toggle is redundant.

> Based on usability guidelines from [NNG](https://www.nngroup.com/articles/progressive-disclosure/)

---

## 🌟 Optional Enhancements (Completed)
- ✅ Bulk delete with visual feedback
- ✅ Optimistic updates on add/update/delete
- ✅ Audio waveform visualization using `wavesurfer.js`

## 📝 License
MIT