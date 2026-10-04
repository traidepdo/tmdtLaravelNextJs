<?php

namespace App\Repositories;
use App\Models\Oder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\ProductVariant;

class OderRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        protected Oder $oder,
        protected ProductVariant $productVariant
    ){}
    public function getOder(string $userId){
        $oder = $this->oder->newQuery()
        ->where('user_id', $userId)
        ->with('orderItems')
        ->get();
        return $oder;
    }
    public function createOder(array $data, string $userId ){
        DB::beginTransaction();
        try {
            $orderCode = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            $subtotal = 0;
            $orderItemsData = [];
            foreach ($data['items'] as $item) {
                $variant = $this->productVariant->newQuery()
                                                ->with('product')
                                                ->lockForUpdate()
                                                ->find($item['product_variant_id']);
                if(!$variant){
                    DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Biến thể sản phẩm không tồn tại.',
                    ], 400);
                }
                if($variant->stock_quantity<$item['quantity']){
                    DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Không đủ số lượng tồn kho',
                    ], 400);
                }
                $unitPrice = $variant->price;
                $lineTotal = $unitPrice * $item['quantity'];
                $subtotal += $lineTotal;
                $variant->decrement('stock_quantity', $item['quantity']);
                if ($variant->product) {
                    $variant->product->increment('count_buy', $item['quantity']);
                }
                $orderItemsData[] = [
                    'product_id' => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product ? $variant->product->name : 'Sản phẩm',
                    'sku' => $variant->sku,
                    'color_name' => $variant->color_name,
                    'size' => $variant->size,
                    'image_url' => $variant->image_url ?? ($variant->product->images->first()->image_url ?? null),
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'total_price' => $lineTotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
            }
            

            DB::commit();
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
        }
       
    }
}
