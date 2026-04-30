<?php

use App\Http\Controllers\Api\GenderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(GenderController::class)->prefix('/gender')->group(function() {
    Route::get('/loadGenders', 'loadGenders'); // /gender/loadGenders
    Route::get('/getGender/{genderId}', 'getGender'); // /gender/getGender/{genderId}
    Route::post('/storeGender', 'storeGender'); // /gender/storeGender
    Route::put('/updateGender/{gender}', 'updateGender');
    Route::put('/destroyGender/{gender}', 'destroyGender');
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
