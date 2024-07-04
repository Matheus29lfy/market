<?php
namespace App\Controllers;

use App\Services\TaxesService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * @OA\PathItem(path="/taxes")
 */
class TaxesController {
    protected $taxesService;

    public function __construct(TaxesService $taxesService) {
        $this->taxesService = $taxesService;
    }

    /**
     * @OA\Get(
     *     path="/taxes",
     *     summary="Get all taxes",
     *     @OA\Response(
     *         response=200,
     *         description="List of taxes",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="taxes", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function getAll(Request $request, Response $response, $args) {
        $taxes = $this->taxesService->getAll();
        $taxesResponse = ["taxes" => $taxes];
        $response->getBody()->write(json_encode($taxesResponse));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * @OA\Post(
     *     path="/taxes",
     *     summary="Create a new tax",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="tax_percentage", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Imposto inserido com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Imposto inserido com sucesso!")
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
     *         description="Erro ao inserir Imposto",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Erro ao inserir Imposto.")
     *         )
     *     )
     * )
     */
    public function insert(Request $request, Response $response, $args) {
        $taxes = $request->getParsedBody();

        if (empty($taxes)) {
            $body = $request->getBody();
            $taxes = json_decode($body, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $response->getBody()->write(json_encode(['message' => 'Invalid JSON']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
        }

        try {
            $taxesReturn = $this->taxesService->insert($taxes);
    
            if ($taxesReturn) {
                $response->getBody()->write(json_encode(['message' => 'Imposto inserido com sucesso!']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
            } else {
                $response->getBody()->write(json_encode(['message' => 'Erro ao inserir Imposto.']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
            }
        } catch (\Exception $exception) {
            $response->getBody()->write(json_encode(['message' => $exception->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
        
    }

    /**
     * @OA\Get(
     *     path="/taxes/{id}",
     *     summary="Show a tax",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Show tax details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="tax", type="object")
     *         )
     *     )
     * )
     */
    public function show(Request $request, Response $response, $args) {
        // Código para mostrar um imposto
    }

    /**
     * @OA\Put(
     *     path="/taxes/{id}",
     *     summary="Update a tax",
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
     *             @OA\Property(property="rate", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tax updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Imposto atualizado com sucesso!")
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
        // Código para atualizar um imposto
    }

    /**
     * @OA\Delete(
     *     path="/taxes/{id}",
     *     summary="Delete a tax",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tax deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Imposto deletado com sucesso!")
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
     *         description="Tax not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Tax not found")
     *         )
     *     )
     * )
     */
    public function delete(Request $request, Response $response, $args) {
        // Código para deletar um imposto
    }
}