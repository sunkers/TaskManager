<?php

namespace App\Service;

use App\Entity\Collection;
use App\Entity\User;
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

    public function initCollection(User $user)
    {
        $entityManager = $this->entityManager;
        // Create 4 basic Collections at the creation of the user
        $collections = ['☀️ My Day' => 'A collection for your daily tasks', '⚠️ Important' => 'Keep your most important tasks here!', '💼 Work' => 'When it comes to work...', '🧑‍💼 Personal' => "Don't forget to pick up the kids!"];
        foreach ($collections as $collection => $description) {
            $newCollection = new Collection();
            $newCollection->setName($collection);
            $newCollection->setDescription($description);
            $newCollection->setCreationDate(new \DateTime());
            $newCollection->setUser($user);
            $entityManager->persist($newCollection);
            $entityManager->flush();
        }
    }

}
