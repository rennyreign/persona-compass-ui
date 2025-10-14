# 🔧 Storage Setup Required - Action Needed!

**Issue:** Persona images are showing 404 errors because DALL-E URLs expire after 1-2 hours.

**Solution:** Store images permanently in Supabase Storage.

## ⚠️ Critical Setup Steps

### Step 1: Create Supabase Storage Bucket

**You need to run this SQL in Supabase SQL Editor:**

1. Go to https://supabase.com/dashboard/project/hhbzjfnqhqcbqzwvjbqw/sql/new
2. Paste and run this SQL:

```sql
-- Create storage bucket for persona images
INSERT INTO storage.buckets (id, name, public)
VALUES ('persona-images', 'persona-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Public read access to persona images
CREATE POLICY "Public Access to Persona Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'persona-images' );

-- Authenticated users can upload persona images
CREATE POLICY "Authenticated users can upload persona images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'persona-images' );

-- Service role can manage all persona images
CREATE POLICY "Service role can manage persona images"
ON storage.objects FOR ALL
TO service_role
USING ( bucket_id = 'persona-images' );

-- Allow authenticated users to update their uploads
CREATE POLICY "Users can update persona images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'persona-images' )
WITH CHECK ( bucket_id = 'persona-images' );

-- Allow authenticated users to delete persona images
CREATE POLICY "Users can delete persona images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'persona-images' );
```

### Step 2: Get Supabase Service Role Key

1. Go to https://supabase.com/dashboard/project/hhbzjfnqhqcbqzwvjbqw/settings/api
2. Copy the **service_role** key (NOT the anon key)
3. **IMPORTANT:** This key has full access - keep it secret!

### Step 3: Set Environment Variable in Netlify

Run this command (replace with your actual service role key):

```bash
npx netlify env:set SUPABASE_SERVICE_ROLE_KEY "your-service-role-key-here"
```

**Or set it in Netlify UI:**
1. Go to https://app.netlify.com/sites/persona-compass/configuration/env
2. Add variable:
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your service role key from Step 2
   - Scopes: All (or at least Functions)

### Step 4: Verify Setup

After completing steps 1-3, test by generating a new persona with images.

## 📊 What Changed

### Before (Broken)
```
DALL-E generates image
  → Returns temporary URL (expires in 1-2 hours)
  → Persona stores temporary URL
  → After expiration: 404 errors ❌
```

### After (Fixed)
```
DALL-E generates image
  → Returns temporary URL
  → Function downloads image
  → Function uploads to Supabase Storage
  → Returns permanent public URL
  → Persona stores permanent URL
  → Images never expire ✅
```

## 🔍 Technical Details

### Updated Function Flow
1. **Generate** - Call DALL-E API to create image
2. **Download** - Fetch image from temporary DALL-E URL
3. **Upload** - Store in Supabase Storage bucket `persona-images`
4. **Return** - Provide permanent public URL

### Storage Structure
```
persona-images/
  └── persona-avatars/
      ├── {personaId}-{timestamp}.png
      ├── {personaId}-{timestamp}.png
      └── ...
```

### Environment Variables Required
- ✅ `OPENAI_API_KEY` - Already set
- ✅ `VITE_SUPABASE_URL` - Already set
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` - **NEEDS TO BE SET**

## 🚨 Why This is Critical

### Current Problem
- DALL-E URLs expire after 1-2 hours
- All existing persona images show 404 errors
- New images will also fail after expiration

### Solution Benefits
- ✅ Permanent image storage
- ✅ No expiration
- ✅ Faster loading (CDN)
- ✅ Full control over images
- ✅ Can delete/update images
- ✅ Backup and versioning possible

## 📝 Files Modified

### Updated Files
1. **`netlify/functions/generate-image.ts`**
   - Added Supabase client import
   - Added image download logic
   - Added Supabase Storage upload
   - Returns permanent URL instead of temporary

2. **`src/components/admin/AIPersonaPromptDialog.tsx`**
   - Now passes `personaId` to function
   - Function needs ID for file naming

3. **`supabase/migrations/20251014020000_create_persona_images_storage.sql`**
   - Storage bucket creation
   - RLS policies for access control

## 🧪 Testing After Setup

### Test Image Generation
1. Go to Admin page
2. Generate new personas with images
3. Check console - should see:
   ```
   Image function response status: 200
   Successfully generated image for [Name]
   ```
4. Verify images load and display correctly
5. Wait 2+ hours and verify images still load (permanent URLs)

### Verify Storage
1. Go to https://supabase.com/dashboard/project/hhbzjfnqhqcbqzwvjbqw/storage/buckets/persona-images
2. Should see uploaded images in `persona-avatars/` folder
3. Click image to verify it's accessible

## 💰 Storage Costs

**Supabase Storage Pricing (Free Tier):**
- Storage: 1 GB free
- Bandwidth: 2 GB free per month

**Image Size Estimates:**
- DALL-E PNG: ~1-2 MB per image
- Free tier: ~500-1000 images
- After free tier: $0.021/GB storage, $0.09/GB bandwidth

**For 100 personas:**
- Storage: ~100-200 MB
- Well within free tier ✅

## 🔐 Security Notes

### Service Role Key
- **DO NOT** commit to Git
- **DO NOT** expose in client-side code
- **ONLY** use in Netlify Functions (server-side)
- Has full database and storage access

### Storage Policies
- Public read access (anyone can view images)
- Authenticated write access (only logged-in users can upload)
- Service role has full access (for functions)

## 📋 Checklist

Before deploying:
- [ ] Run SQL to create storage bucket
- [ ] Get service role key from Supabase
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` in Netlify
- [ ] Verify bucket exists in Supabase dashboard
- [ ] Test image generation
- [ ] Verify images persist after 2+ hours

## 🆘 Troubleshooting

### Error: "Supabase credentials not configured"
**Fix:** Set `SUPABASE_SERVICE_ROLE_KEY` environment variable

### Error: "Bucket not found"
**Fix:** Run the SQL to create the `persona-images` bucket

### Error: "Permission denied"
**Fix:** Check RLS policies are created correctly

### Images still showing 404
**Fix:** 
1. Verify storage bucket exists
2. Check function logs for upload errors
3. Regenerate personas to get new permanent URLs

## 🎯 Next Steps

1. **Complete Steps 1-3 above** (SQL, get key, set env var)
2. **Commit and deploy** the code changes
3. **Test** by generating new personas
4. **Optional:** Regenerate existing personas to fix their images

## 📄 Summary

**The code is ready, but requires manual setup in Supabase:**
1. Create storage bucket (SQL)
2. Get service role key
3. Set environment variable

**Once complete, all persona images will be stored permanently and never expire! 🎉**

---

**Migration File:** `supabase/migrations/20251014020000_create_persona_images_storage.sql`  
**Status:** ⚠️ Awaiting manual setup  
**Priority:** 🔴 Critical - Required for image persistence
