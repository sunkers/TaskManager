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

    /**
     * @Route("/getFolders", name="getFolders", methods={"GET"})
     */
    public function getFolders(FolderService $folderService, SerializerService $serializerService): Response
    {
        $folders = $folderService->getFolders();
        $jsonFolders = $serializerService->getSerializer()->serialize($folders, 'json');
    
        return new Response($jsonFolders, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/folder/new", name="folder_new", methods={"GET","POST"})
     */
    public function new(Request $request, FolderService $folderService): Response
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null || !isset($data['collectionName']) || !isset($data['collectionDescription'])) {
            return new Response('Invalid JSON', Response::HTTP_BAD_REQUEST);
        }

        try {
            $folderService->createFolder($data['collectionName'], $data['collectionDescription']);
            return new Response('Folder successfully created', Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new Response('Error: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
