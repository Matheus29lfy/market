<?php
namespace App\Controllers;

use App\Services\TypeProductService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * @OA\PathItem(path="/type-products")
 */
class TypeProductController {
    protected $typeProductService;

    public function __construct(TypeProductService $typeProductService) {
        $this->typeProductService = $typeProductService;
    }

    /**
     * @OA\Get(
     *     path="/type-products",
     *     summary="Get all types of products",
     *     @OA\Response(
     *         response=200,
     *         description="List of types of products",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="type_product", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function getAll(Request $request, Response $response, $args) {
 
       try {
             $typeProduct = $this->typeProductService->getAll();
             $response->getBody()->write(json_encode(["type_product" => $typeProduct]));
        
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
       } catch (\RuntimeException $e) {
        $statusCode = $e->getCode() === 400 ? 400 : 500;
        
        $response->getBody()->write(json_encode([
            'error' => $e->getMessage(),
            'status' => $statusCode
        ]));
        
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($statusCode);
       }
    }

    /**
     * @OA\Post(
     *     path="/type-products",
     *     summary="Create a new type of product",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="description", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Tipo de produto inserido com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Tipo de produto inserido com sucesso!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid JSON",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invalid JSON")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao inserir Tipo de produto",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Erro ao inserir Tipo de produto.")
     *         )
     *     )
     * )
     */
    public function insert(Request $request, Response $response, $args) {
        $typeProduct = $request->getParsedBody();

        if (empty($typeProduct)) {
            $body = $request->getBody();
            $typeProduct = json_decode($body, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $response->getBody()->write(json_encode(['message' => 'Invalid JSON']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
        }

        $typeProductReturn = $this->typeProductService->insert($typeProduct);

        if ($typeProductReturn) {
            $response->getBody()->write(json_encode(['message' => 'Tipo de produto inserido com sucesso!']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        } else {
            $response->getBody()->write(json_encode(['message' => 'Erro ao inserir Tipo de produto.']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * @OA\Get(
     *     path="/type-products/{id}",
     *     summary="Show a type of product",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Show type of product details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="type_product", type="object")
     *         )
     *     )
     * )
     */
    public function show(Request $request, Response $response, $args) {
        // Código para mostrar um tipo de produto
    }

    /**
     * @OA\Put(
     *     path="/type-products/{id}",
     *     summary="Update a type of product",
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
     *             @OA\Property(property="description", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tipo de produto atualizado com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Tipo de produto atualizado com sucesso!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid data",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invalid data")
     *         )
     *     )
     * )
     */
    public function update(Request $request, Response $response, $args) {
        // Código para atualizar um tipo de produto
    }

    /**
     * @OA\Delete(
     *     path="/type-products/{id}",
     *     summary="Delete a type of product",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tipo de produto deletado com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Tipo de produto deletado com sucesso!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid ID supplied",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invalid ID supplied")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Tipo de produto não encontrado",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Tipo de produto não encontrado")
     *         )
     *     )
     * )
     */
    public function delete(Request $request, Response $response, $args) {
        // Código para deletar um tipo de produto
    }
}