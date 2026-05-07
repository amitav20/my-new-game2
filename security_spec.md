# Security Specification for Soulbound

## Data Invariants
1. A Character can only be created or modified if it belongs to the authenticated user.
2. Users cannot modify other users' currencies or profiles.
3. Affection level must be between 0 and 100.
4. Terminal states (like quest completion) should be protected.
5. Currencies cannot be negative.
6. Identity spoofing (setting ownerId to others) must be blocked via the path variables.

## The Dirty Dozen Payloads

### 1. Identity Spoofing (Write to another user's profile)
- Path: `/users/target_user_id`
- Payload: `{"coins": 999999}`
- Result: **PERMISSION_DENIED**

### 2. Large ID Injection (Resource Poisoning)
- Path: `/users/very_long_junk_string_id_...`
- Payload: `{...}`
- Result: **PERMISSION_DENIED**

### 3. Ghost Field Injection (Shadow Update)
- Path: `/users/my_id`
- Payload: `{"coins": 100, "isVerifiedAdmin": true}`
- Result: **PERMISSION_DENIED**

### 4. Self-Assigned Level (Privilege Escalation)
- Path: `/users/my_id/characters/char1`
- Payload: `{"level": 100}` (via update without XP check logic bypass)
- Result: **PERMISSION_DENIED**

### 5. Negative Currency (Integrity)
- Path: `/users/my_id`
- Payload: `{"coins": -100}`
- Result: **PERMISSION_DENIED**

### 6. PII Leak (Read another user's private info)
- Path: `/users/target_user_id`
- Operation: `get`
- Result: **PERMISSION_DENIED**

### 7. Global List Query (Query Scraping)
- Path: `/users`
- Operation: `list` (without user filter)
- Result: **PERMISSION_DENIED**

### 8. Orphaned Character (Write character to non-existent user)
- Path: `/users/fake_id/characters/char1`
- Operation: `create`
- Result: **PERMISSION_DENIED** (Relational Sync)

### 9. Interaction Overwrite (Modify someone else's character affection)
- Path: `/users/target_id/characters/char1`
- Payload: `{"affection": 0}`
- Result: **PERMISSION_DENIED**

### 10. Quest Cheat (Complete quest without requirement)
- Path: `/users/my_id/quests/q1`
- Payload: `{"isCompleted": true}` (Directly setting without action logic)
- Result: **PERMISSION_DENIED** (Actually we'll allow User to update their own quest progress usually, but we should enforce strict schema)

### 11. Immutable Field Tamper (Change createdAt)
- Path: `/users/my_id`
- Payload: `{"createdAt": 123456}` (on update)
- Result: **PERMISSION_DENIED**

### 12. Timestamp Spoofing (Client time)
- Path: `/users/my_id`
- Payload: `{"updatedAt": 1000000}` (instead of request.time)
- Result: **PERMISSION_DENIED**
