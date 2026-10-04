<?php

namespace App\Services;
use App\Repositories\OderRepo;
class OderServices
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected OderRepo $oderRepo)
    {
        
    }
    public function getOder(string $userId){
        $oder = $this->oderRepo->getOder($userId);
        return $oder;
    }
}
