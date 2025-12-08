<?php
require_once __DIR__ . '/../Database.php';

abstract class Model
{
    protected static string $table;
    protected static string $primaryKey = 'id';

    public static function all(): array
    {
        $db = Database::connect();
        $stmt = $db->query("SELECT * FROM " . static::$table);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find(int $id): ?array
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            "SELECT * FROM " . static::$table . " WHERE " . static::$primaryKey . " = :id"
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public static function create(array $data): bool
    {
        $db = Database::connect();

        $columns = implode(',', array_keys($data));
        $params  = ':' . implode(',:', array_keys($data));

        $sql = "INSERT INTO " . static::$table . " ($columns) VALUES ($params)";
        $stmt = $db->prepare($sql);

        return $stmt->execute($data);
    }

    public static function truncate(): void
    {
        $db = Database::connect();
        $db->exec("DELETE FROM " . static::$table);
    }
}
