<?php

namespace App\Services;
use App\Repositories\LikeRepo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class LikeService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected LikeRepo $likeRepo) {
    }

    public function getList(int $userId, array $filter = [], int $limit = 10):LengthAwarePaginator
    {
        return $this->likeRepo->getList($userId, $filter, $limit);
    }
    public function toggle(int $userId, int $productId)
    {
        return $this->likeRepo->toggleSave($userId, $productId);
    }
}
