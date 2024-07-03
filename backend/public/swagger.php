<?php
require __DIR__ . '/../vendor/autoload.php';

use OpenApi\Generator;

header('Content-Type: application/json');
/**
 * @OA\OpenApi(
 *     @OA\Info(
 *         title="API market",
 *         version="1.0"
 *     ),
 *     @OA\Server(
 *         url="http://localhost:8080"
 *     ),
 *     @OA\PathItem(
 *         path="/auth"
 *     ),
 *     @OA\PathItem(
 *         path="/products"
 *     )
 * )
 */

$openapi = Generator::scan(['../src/Controllers']);
echo $openapi->toJson();