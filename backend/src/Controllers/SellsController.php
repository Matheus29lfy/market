<?php
namespace App\Controllers;

use App\Services\SellsService;
use App\Services\ProductsService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * @OA\PathItem(path="/sells")
 */
class SellsController {
    protected $sellsService;
    protected $productsService;

    public function __construct(SellsService $sellsService, ProductsService $productsService) {
        $this->sellsService = $sellsService;
        $this->productsService = $productsService;
    }

    /**
     * @OA\Get(
     *     path="/sells",
     *     summary="Get all sells",
     *     @OA\Response(
     *         response=200,
     *         description="List of sells",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="sells", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function getAll(Request $request, Response $response, $args) {
        $sells = $this->sellsService->getAll();
        $sellsResponse = ["sells" => $sells];
        $response->getBody()->write(json_encode($sellsResponse));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * @OA\Post(
     *     path="/sells",
     *     summary="Create a new sell",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="product_id", type="array", @OA\Items(type="integer")),
     *             @OA\Property(property="quantity", type="array", @OA\Items(type="integer")),
     *             @OA\Property(property="total_no_tax", type="number", format="float"),
     *             @OA\Property(property="total_with_taxes", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Venda salva com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Venda salva com sucesso!")
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
     *         description="Erro ao salvar venda",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Erro ao salvar venda.")
     *         )
     *     )
     * )
     */
    public function create(Request $request, Response $response, $args) {
        $sell = $request->getParsedBody();

        if (empty($sell)) {
            $body = $request->getBody();
            $sell = json_decode($body, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $response->getBody()->write(json_encode(['message' => 'Invalid JSON']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
        }
        try {

            // Verifica se os arrays têm mais de um elemento
            if (count($sell['product_id']) > 1) {
                // Insere em lote
                $sellReturn = $this->sellsService->insertBatch($sell);
                $responseQuantityProduct = $this->productsService->updateQuantityBatch($sell['product_id'], $sell['quantity']);
            } else {
                $sellReturn = $this->sellsService->insertSingle($sell);
                $responseQuantityProduct = $this->productsService->updateQuantitySingle($sell['product_id'][0], $sell['quantity'][0]);
            }

            if ($sellReturn && $responseQuantityProduct) {
                $response->getBody()->write(json_encode(['message' => 'Venda salva com sucesso!']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
            } else {
                $response->getBody()->write(json_encode(['message' => 'Erro ao salvar venda.']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
            }
        } catch (\Exception $exception) {
            $response->getBody()->write(json_encode(['message' => $exception->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * @OA\Get(
     *     path="/sells/{id}",
     *     summary="Show a sell",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Show sell details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="sell", type="object")
     *         )
     *     )
     * )
     */
    public function show(Request $request, Response $response, $args) {
        // Código para mostrar uma venda
    }

    /**
     * @OA\Put(
     *     path="/sells/{id}",
     *     summary="Update a sell",
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
     *             @OA\Property(property="product_id", type="integer"),
     *             @OA\Property(property="quantity", type="integer"),
     *             @OA\Property(property="total_no_tax", type="number", format="float"),
     *             @OA\Property(property="total_with_taxes", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Sell updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Venda atualizada com sucesso!")
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
        // Código para atualizar uma venda
    }

    /**
     * @OA\Delete(
     *     path="/sells/{id}",
     *     summary="Delete a sell",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Sell deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Venda deletada com sucesso!")
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
     *         description="Sell not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Sell not found")
     *         )
     *     )
     * )
     */
    public function delete(Request $request, Response $response, $args) {
        // Código para deletar uma venda
    }
}