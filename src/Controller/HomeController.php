<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\CollectionService;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index(SessionInterface $session, CollectionService $collectionService): Response
    {
        $is_logged = false;
        if ($this->getUser() !== null) {
            $is_logged = true;
            $collections = $collectionService->getCollections();
            $defaultCollections = $collectionService->getCollectionsDefault();
            $currentCollectionName = ($session->set('currentCollection', '☀️ My Day'));
            $currentCollection = $collectionService->getCollectionByName('☀️ My Day');
        } else {
            $collections = '';
            $defaultCollections = '';
            $currentCollectionName = '';
            $currentCollection = '';
        }
        

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'currentCollection' => $currentCollection,
            'collections' => $collections,
            'defaultCollections' => $defaultCollections,
            'is_logged' => $is_logged
        ]);
    }
}
