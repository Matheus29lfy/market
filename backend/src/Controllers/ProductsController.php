<?php
namespace App\Controllers;

use App\Services\ProductsService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**

 * @OA\PathItem(path="/products")
 */
class ProductsController {
    protected $productsService;

    public function __construct(ProductsService $productsService) {
        $this->productsService = $productsService;
    }

    /**
     * @OA\Get(
     *     path="/products",
     *     summary="Get all products",
     *     @OA\Response(
     *         response=200,
     *         description="List of products",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="products", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function getAll(Request $request, Response $response, $args) {
        $products = $this->productsService->getAll();
        $productsResponse = ["products" => $products];
        $response->getBody()->write(json_encode($productsResponse));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * @OA\Post(
     *     path="/products",
     *     summary="Insert a new product",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="price", type="number")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Product inserted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid JSON",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error inserting product",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function insert(Request $request, Response $response, $args) {
        $product = $request->getParsedBody();
     
        if (empty($product)) {
            $body = $request->getBody();
            $product = json_decode($body, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $response->getBody()->write(json_encode(['message' => 'Invalid JSON']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
        }
     
        $productReturn = $this->productsService->insert($product);

        if ($productReturn) {
            $response->getBody()->write(json_encode(['message' => 'Produto inserido com sucesso!']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        } else {
            $response->getBody()->write(json_encode(['message' => 'Erro ao inserir produto.']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * @OA\Get(
     *     path="/products/show",
     *     summary="Get all products to show",
     *     @OA\Response(
     *         response=200,
     *         description="List of products to show",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="products", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function getAllProductsToShow(Request $request, Response $response, $args) {
        $products = $this->productsService->getAllProductsToShow();
        $productsResponse = ["products" => $products];
        $response->getBody()->write(json_encode($productsResponse));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * @OA\Put(
     *     path="/products/{id}",
     *     summary="Update a product",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="price", type="number")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid data",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function update(Request $request, Response $response, $args) {
        // Código para atualizar um produto
    }

    /**
     * @OA\Delete(
     *     path="/products/{id}",
     *     summary="Delete a product",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid ID supplied",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function delete(Request $request, Response $response, $args) {
        // Código para deletar um produto
    }
}
