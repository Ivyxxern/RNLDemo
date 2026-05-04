<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function loadUsers()
    {
        $users = User::query()
            ->with('gender')
            ->where('is_deleted', 0)
            ->orderBy('user_id')
            ->get()
            ->map(function (User $user) {
                return [
                    'user_id' => $user->user_id,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name ?? '',
                    'last_name' => $user->last_name,
                    'suffix_name' => $user->suffix_name ?? '',
                    'gender' => $user->gender?->gender ?? '',
                    'birth_date' => $user->birth_date?->format('Y-m-d'),
                    'age' => $user->age,
                    'username' => $user->username,
                ];
            });

        return response()->json([
            'users' => $users,
        ]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate(
            [
                'first_name' => ['required', 'max:55'],
                'middle_name' => ['nullable',  'max:55'],
                'last_name' => ['required',  'max:55'],
                'suffix_name' => ['nullable', 'max:55'],
                'gender' => ['required', 'exists:tbl_genders,gender_id'],
                'birth_date' => ['required', 'date'],
                'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')],
                'password' => ['required', 'min:6', 'max:12', 'confirmed'],
                'password_confirmation' => ['required', 'min:6', 'max:12'],
            ],
            [
                'username.unique' => 'Username is already taken',
            ]
        );

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

         User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'username' => $validated['username'],
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'User Successfully Saved.'
        ], 200);
    }
}
