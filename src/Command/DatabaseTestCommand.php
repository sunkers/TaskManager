<?php
namespace App\Command;

use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class DatabaseTestCommand extends Command
{
    protected static $defaultName = 'app:database:test';

    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;

        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Tests the database connection.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $this->connection->connect();
        } catch (\Exception $e) {
            $output->writeln('<error>Failed to connect to the database.</error>');
            $output->writeln(sprintf('<error>%s</error>', $e->getMessage()));

            return Command::FAILURE;
        }

        $output->writeln('<info>Successfully connected to the database.</info>');

        return Command::SUCCESS;
    }
}
