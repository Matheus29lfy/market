<?php

namespace App\Repositories;

use App\Database\Connection;
use PDOException;

class SellsRepository {
    private $db;

    public function __construct(Connection $db) {
        $this->db = $db->getPdo();
    }

    public function getAll() {
        try {
            $stmt = $this->db->query('
            SELECT 
                s.id, s.total_no_tax, s.total_with_taxes, s.user_id, u.username, s.created_at,
                sp.product_id, p.name, sp.quantity
            FROM sells s
            LEFT JOIN users u ON u.id = s.user_id
            LEFT JOIN sell_products sp ON sp.sell_id = s.id
            LEFT JOIN products p ON p.id = sp.product_id
        ');

         return  $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        // // Verifica se há resultados
        // if (empty($result)) {
        //     throw new \RuntimeException('Erro ao buscar vendas. Por favor, tente novamente mais tarde', 400);
        // }
        
        // return $result;
        }catch (PDOException $e) {
            // Log do erro (opcional)
            error_log('Database error: ' . $e->getMessage());
            
            // Lança uma exceção personalizada ou retorna um array de erro
            throw new \RuntimeException('Erro ao buscar vendas. Por favor, tente novamente mais tarde.');
        }
    }
    
    public function insertSingle($sell): bool {
        try {
            $this->db->beginTransaction();

            $sql = "INSERT INTO sells (user_id, total_no_tax, total_with_taxes) VALUES (:user_id, :total_no_tax, :total_with_taxes)";
            $stmt = $this->db->prepare($sql);

            $stmt->bindParam(':user_id', $sell['user_id']);
            $stmt->bindParam(':total_no_tax', $sell['total_no_tax']);
            $stmt->bindParam(':total_with_taxes', $sell['total_with_taxes']);
            $stmt->execute();

            $sellId = $this->db->lastInsertId();

            $sqlItem = "INSERT INTO sell_items (sell_id, product_id, quantity) VALUES (:sell_id, :product_id, :quantity)";
            $stmtItem = $this->db->prepare($sqlItem);

            $stmtItem->bindParam(':sell_id', $sellId);
            $stmtItem->bindParam(':product_id', $sell['product_id'][0]);
            $stmtItem->bindParam(':quantity', $sell['quantity'][0]);

            $stmtItem->execute();

            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function insertBatch($sell): bool {
        try {
            $this->db->beginTransaction();

            $sql = "INSERT INTO sells (user_id, total_no_tax, total_with_taxes) VALUES (:user_id, :total_no_tax, :total_with_taxes)";
            $stmt = $this->db->prepare($sql);

            $stmt->bindParam(':user_id', $sell['user_id']);
            $stmt->bindParam(':total_no_tax', $sell['total_no_tax']);
            $stmt->bindParam(':total_with_taxes', $sell['total_with_taxes']);
            $stmt->execute();

            $sellId = $this->db->lastInsertId();

            $sqlItem = "INSERT INTO sell_items (sell_id, product_id, quantity) VALUES ";
            $values = [];
            $params = [];

            foreach ($sell['product_id'] as $index => $productId) {
                $values[] = "(?, ?, ?)";
                $params[] = $sellId;
                $params[] = $productId;
                $params[] = $sell['quantity'][$index];
            }

            $sqlItem .= implode(", ", $values);
            $stmtItem = $this->db->prepare($sqlItem);

            $stmtItem->execute($params);

            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}