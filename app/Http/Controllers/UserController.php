<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function create(Request $request)
    {
        $user = User::create($request->all());
        $user->password = Hash::make($request->password);
        $user->role = 1;

        $token = $user->createToken("hello", [])->accessToken;
        return response([
            'status' => 200,
            'access_token' => $token,
            'user_id' => $user->id,
            'user' => $user,
            'message' => 'Successful'
        ])->cookie('name', $token, 20160);
    }

    public function getAll()
    {
        $users = User::with('role')->get();
        return response()->json($users, 200);
    }

    public function getOne($id)
    {
        $user = User::with('role')->find($id);
        if (!$user) {
            return response()->json([
                "status" => 404,
                "message" => "No user found"
            ], 404);
        } else {
            if ($user->role === "User") {
                return response()->json([
                    "message" => "AccountUserException"
                ]);
            } else {
                return response()->json($user, 200);
            }
        }
    }

    public function editOne(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                "status" => 404,
                "message" => "No user found"
            ], 404);
        } else {
            $user->fill([
                'honorific' => $request->honorific,
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'middlename' => $request->middlename,
                'contactno' => $request->contactno,
                'address' => $request->address
            ]);
            if ($request->email) {
                $user->email = $request->email;
            }
            if ($request->role_id) {
                $user->role_id = $request->role_id;
            }
            $user->save();
            return response()->json($user, 200);
        }
    }

    public function editPassword($id, Request $request)
    {
        $user = User::find($id);
        if (Hash::check($request->oldPassword, $user->password)) {
            $user->password = Hash::make($request->newPassword);
            $user->save();
            return response()->json("Sucess!", 200);
        } else {
            return response()->json("PasswordNotMatch", 401);
        }
    }

    public function deleteOne($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                "status" => 200,
                "message" => "No user found"
            ], 404);
        } else {
            User::destroy($id);
            return response()->json([
                'status' => 200,
                'message' => "You have successfully deleted the item"
            ], 200);
        }
    }
    public function getGuestUsers()
    {
        $users = User::where('role_id', 1)->get();
        return response()->json($users, 200);
    }

    public function getAdminAccounts()
    {
        $users = User::where('role_id', '!=', 1)->with('role')->get();
        return response()->json($users, 200);
    }


    public function checkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'unique:users',
        ]);

        if ($validator->fails()) {
            $user = User::where('email', $request->email)->first();
            if ($user->role === "ADMIN")
                return response()->json([
                    "code" => "EmailHasTaken"
                ], 500);
            else return response()->json("OK", 200);
        } else {
            return response()->json("OK", 200);
        }
    }

    public function getUserBookings($id, Request $request)
    {
        $user = User::with(['bookings' => function ($query) {
            $query->with(['user', 'rooms', 'billings'])->orderBy('from_date', 'desc');
        }])->find($id);
        $bookings = $user->bookings;
        return response()->json($bookings, 200);
    }

    public function getUserNotifications($id)
    {
        $user = User::find($id);
        $notifications = $user->notifications;
        $unreadNotifications = $user->unreadNotifications;
        return response()->json([
            "notifications" => $notifications,
            "unreadNotifications" => count($unreadNotifications)
        ]);
    }

    public function markOneNotificationRead($id, $notificationId)
    {
        $user = User::find($id);
        $notification = DatabaseNotification::find($notificationId);
        $notification->read_at = Carbon::now();
        $notification->save();
        return response()->json($notification);
    }

    public function maekAllNotificationRead($id)
    {
        $user = User::find($id);
        $user->unreadNotifications->markAsRead();
        return response()->json("Success!;");
    }
}
