<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Absolute URL to a file under storage/app/public/... (exposed as /storage/...).
     * Uses the current request root so subfolder installs (e.g. XAMPP /RNLDemo/server/public) work
     * even when APP_URL or filesystem disk "url" is only "http://localhost".
     */
    protected function absoluteStorageUrl(string $relativeWithinStorageAppPublic): string
    {
        $path = ltrim(str_replace('\\', '/', $relativeWithinStorageAppPublic), '/');
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, strlen('storage/'));
        }

        $base = null;
        if (! app()->runningInConsole()) {
            try {
                $base = request()->root();
            } catch (\Throwable) {
                $base = null;
            }
        }

        $root = rtrim($base ?: (string) config('app.url'), '/');

        return $root.'/storage/'.$path;
    }

    /**
     * Public URL for a stored profile picture, or null if nothing usable exists.
     *
     * Primary layout: files under storage/app/public/profile_pictures (public disk),
     * served via the public/storage → storage/app/public symlink.
     *
     * Also supports older rows: basename under local tutorial folder, profile/ on local disk.
     */
    protected function resolveProfilePictureUrl(?string $stored): ?string
    {
        if ($stored === null || $stored === '') {
            return null;
        }

        $stored = trim(str_replace('\\', '/', $stored));

        if (filter_var($stored, FILTER_VALIDATE_URL)) {
            $parts = parse_url($stored);
            if (! empty($parts['path']) && str_starts_with($parts['path'], '/storage/')) {
                $rel = ltrim(substr($parts['path'], strlen('/storage/')), '/');

                return $this->absoluteStorageUrl($rel);
            }

            return $stored;
        }

        $stored = ltrim($stored, '/');

        if (str_starts_with($stored, 'storage/')) {
            return $this->absoluteStorageUrl(substr($stored, strlen('storage/')));
        }

        $public = Storage::disk('public');
        $local = Storage::disk('local');

        if ($public->exists($stored)) {
            return $this->absoluteStorageUrl($stored);
        }

        if (! str_contains($stored, '/') && $public->exists('profile_pictures/'.$stored)) {
            return $this->absoluteStorageUrl('profile_pictures/'.$stored);
        }

        if (! str_contains($stored, '/') && $local->exists('public/img/user/profile_picture/'.$stored)) {
            return $this->absoluteStorageUrl('public/img/user/profile_picture/'.$stored);
        }

        if ($local->exists($stored)) {
            return $this->absoluteStorageUrl($stored);
        }

        $basename = basename($stored);
        if ($basename !== $stored && $local->exists('profile/'.$basename)) {
            return $this->absoluteStorageUrl('profile/'.$basename);
        }

        if (! str_contains($stored, '/') && $local->exists('profile/'.$stored)) {
            return $this->absoluteStorageUrl('profile/'.$stored);
        }

        return null;
    }

    /**
     * Remove the image file for a stored profile_picture DB value.
     */
    protected function deleteStoredProfilePictureFile(?string $stored): void
    {
        if ($stored === null || $stored === '') {
            return;
        }

        $stored = trim(str_replace('\\', '/', $stored));

        if (filter_var($stored, FILTER_VALIDATE_URL)) {
            return;
        }

        $public = Storage::disk('public');
        $local = Storage::disk('local');

        if (str_starts_with($stored, 'profile_pictures/')) {
            if ($public->exists($stored)) {
                $public->delete($stored);
            }
            if ($local->exists($stored)) {
                $local->delete($stored);
            }

            return;
        }

        $basename = basename($stored);
        $tryPaths = array_unique([
            'profile_pictures/'.$basename,
            'public/img/user/profile_picture/'.$basename,
            'profile/'.$basename,
            $stored,
        ]);

        foreach ($tryPaths as $path) {
            if ($public->exists($path)) {
                $public->delete($path);

                return;
            }
            if ($local->exists($path)) {
                $local->delete($path);

                return;
            }
        }
    }

    public function loadUsers(Request $request)
    {
        $search = $request->input('search');

        $users = User::query()
            ->select('tbl_users.*')
            ->with(['gender'])
            ->leftJoin('tbl_genders', 'tbl_users.gender_id', '=', 'tbl_genders.gender_id')
            ->where('tbl_users.is_deleted', false)
            ->orderBy('tbl_users.last_name', 'asc')
            ->orderBy('tbl_users.first_name', 'asc')
            ->orderBy('tbl_users.middle_name', 'asc')
            ->orderBy('tbl_users.suffix_name', 'asc');

        if ($search) {
            $users->where(function ($query) use ($search) {
                $query->where('tbl_users.first_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.middle_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.last_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.suffix_name', 'like', "%{$search}%")
                    ->orWhere('tbl_genders.gender', 'like', "%{$search}%");
            });
        }

        $users = $users->paginate(15);

        $users->getCollection()->transform(function ($user) {
            $user->profile_picture = $this->resolveProfilePictureUrl($user->profile_picture);

            return $user;
        });

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'add_user_profile_picture' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')],
            'password' => ['required', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['required', 'min:6', 'max:12'],
        ]);

        if ($request->hasFile('add_user_profile_picture')) {
            $validated['add_user_profile_picture'] = $request->file('add_user_profile_picture')->store(
                'profile_pictures',
                'public'
            );
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        User::create(
            [
                'profile_picture' => $validated['add_user_profile_picture'] ?? null,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'],
                'last_name' => $validated['last_name'],
                'suffix_name' => $validated['suffix_name'],
                'gender_id' => $validated['gender'],
                'birth_date' => $validated['birth_date'],
                'age' => $age,
                'username' => $validated['username'],
                'password' => $validated['password'],
            ]
        );

        return response()->json([
            'message' => 'User Successfully Saved.',
        ], 200);
    }

    public function updateUser(Request $request, User $user)
    {
        if ($user->is_deleted) {
            abort(404);
        }

        $validated = $request->validate([
            'remove_profile_picture' => ['nullable', 'in:0,1'],
            'edit_user_profile_picture' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')->ignore($user)],
        ]);

        $currentPicture = $user->getRawOriginal('profile_picture');
        $profilePicture = $currentPicture;

        if ($request->has('remove_profile_picture') && (string) $request->input('remove_profile_picture') === '1') {
            $this->deleteStoredProfilePictureFile($currentPicture);
            $profilePicture = null;
        } elseif ($request->hasFile('edit_user_profile_picture')) {
            $this->deleteStoredProfilePictureFile($currentPicture);

            $profilePicture = $request->file('edit_user_profile_picture')->store(
                'profile_pictures',
                'public'
            );
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $user->forceFill([
            'profile_picture' => $profilePicture,
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'username' => $validated['username'],
        ])->save();

        $user->refresh();
        $user->profile_picture = $this->resolveProfilePictureUrl($user->profile_picture);

        return response()->json([
            'message' => 'User Successfully Updated.',
            'user' => $user,
        ], 200);
    }

    public function destroyUser(User $user) {
        $user->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'User Successfully Deleted.'
        ], 200);
    }
}
