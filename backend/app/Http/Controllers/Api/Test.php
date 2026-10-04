<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Services\OderServices;

class Test extends Controller
{
    //khai báo biến trong class
    public function __construct(protected Product $query, protected OderServices $oderServices) {
    }
    public function index(string $slug){
        $query = $this->query->newQuery()
        ->where('slug', $slug)
        ->with('variants')
        ->get();
        return response()->json($query);
    }
    public function oder(string $userId){
        $query = $this->oderServices->getOder($userId);
        return response()->json($query);
    }
}
