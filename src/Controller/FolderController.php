<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Service\FolderService;
use App\Service\SerializerService;

class FolderController extends AbstractController
{

    /**
     * @Route("/getCurrentFolder", name="getCurrentFolder")
     */
    public function getCurrentFolder(SessionInterface $session, FolderService $folderService, SerializerService $serializerService): Response
    {
        $currentFolderName = $session->get('currentFolder');
        $currentFolder = $folderService->getFolderByName($currentFolderName);
        $jsonFolders = $serializerService->getSerializer()->serialize($currentFolder, 'json');
    
        return new Response($jsonFolders, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/changeFolder", name="changeFolder", methods={"POST"})
     */
    public function changeFolder(Request $request, SessionInterface $session, FolderService $folderService): Response
    {
        $folderName = $request->request->get('folderName');
        $session->set('currentFolder', $folderName);
        
        return new Response('Folder successfully changed', Response::HTTP_OK);
    }

}
