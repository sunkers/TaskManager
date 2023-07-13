<?php

namespace App\Service;

use App\Entity\Collection;
use App\Repository\CollectionRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Doctrine\ORM\EntityManagerInterface;

class CollectionService
{
    private CollectionRepository $collectionRepository;
    private Security $security;
    private $requestStack;
    private EntityManagerInterface $entityManager;

    public function __construct(
        CollectionRepository $collectionRepository, 
        Security $security,
        RequestStack $requestStack,
        EntityManagerInterface $entityManager,
    ) 
    {
        $this->collectionRepository = $collectionRepository;
        $this->security = $security;
        $this->entityManager = $entityManager;
        $this->requestStack = $requestStack;
    }

    public function getCollections()
    {
        if ($this->security->getUser() !== null) {
            // L'utilisateur est connecté, récupérer les collections de la base de données
            return $this->collectionRepository->findAll();
        } else {
            $session = $this->requestStack->getSession();
            return $session->get('collections', []);
        }
    }

    public function getCollectionByName(string $name)
    {
        if ($this->security->getUser() !== null) {
            // L'utilisateur est connecté, récupérer la collection de la base de données
            $collection = $this->collectionRepository->findOneBy(['name' => $name]);
            if ($collection === null) {
                throw new \Exception("Collection not found");
            }
            return $collection;
        } else {
            // L'utilisateur n'est pas connecté, récupérer la collection depuis la session
            $session = $this->requestStack->getSession();
            $collections = $session->get('collections', []);
            foreach ($collections as $collection) {
                if ($collection['name'] == $name) {
                    return $collection;
                }
            }
            throw new \Exception("Collection not found");
        }
    }

    public function initCollection()
    {
        $collection = new Collection();
        $collection->setUser($this->security->getUser());
        $collection->setName('My Day');
        $collection->setDescription('A collection of tasks for today');
        $collection->setCreationDate(new \DateTime());
        $session = $this->requestStack->getSession();
        $session->set('currentCollection', $collection);
    }

}
