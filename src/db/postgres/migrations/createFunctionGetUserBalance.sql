-- Resolvi o problema com uma view, mas vou guardar esse exemplo de function para uso futuro

CREATE OF REPLACE FUNCTION get_user_palance(uid UUID)
RETURNS TABLE(
    earnings NUMERIC(10,2),
    expenses NUMERIC(10,2),
    investments NUMERIC(10,2),
    balance NUMERIC(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) AS earnings,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
        SUM(CASE WHEN type = 'INVESTMENT'THEN amount ELSE 0 END) AS investiments,
        (
        SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END)
        - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
        - SUM(CASE WHEN type = 'INVESTMENT'THEN amount ELSE 0 END)
        ) AS balance
        FROM transactions
         WHERE user_id = get_user_balance.uid;
END; $$
LANGUAGE plpgsql;

-- Para chamar a função, basta executar um select convencional, porém chamando a função ao invés de uma tabela:
-- SELECT * FROM get_user_balance(<userId>)
-- Consultando no ChatGPT, veio a informação de que executar a query diretamente pelo nodeJS é mais performático do que com functions ou view no DB