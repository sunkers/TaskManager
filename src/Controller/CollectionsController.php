<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Service\CollectionService;

class CollectionsController extends AbstractController
{
    /**
     * @Route("/getCurrentCollection", name="getCurrentCollection")
     */
    public function getCurrentCollection(SessionInterface $session, CollectionService $collectionService): Response
    {
        $currentCollectionName = $session->get('currentCollection');
        $currentCollection = $collectionService->getCollectionByName($currentCollectionName);

        // Transform the Collection object to an array and return it as JSON
        $collectionArray = [
            'name' => $currentCollection->getName(),
            'description' => $currentCollection->getDescription(),
            // add any other fields from the Collection object that you need
        ];

        return new JsonResponse($collectionArray);
    }

    /**
     * @Route("/changeCollection", name="changeCollection", methods={"POST"})
     */
    public function changeCollection(Request $request, SessionInterface $session, CollectionService $collectionService): Response
    {
        $collectionName = $request->request->get('collectionName');
        $session->set('currentCollection', $collectionName);
        
        // Depending on your app's requirements, you may need to return a Response here.
        return new Response('Collection successfully changed', Response::HTTP_OK);
    }

}
