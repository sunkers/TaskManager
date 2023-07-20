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
    public function getCurrentFolder(SessionInterface $session, SerializerService $serializerService): Response
    {
        $currentFolder = $session->get('currentFolder');

        if ($currentFolder === null) {
            return new JsonResponse(['error' => 'No current folder set'], JsonResponse::HTTP_NOT_FOUND);
        }

        $jsonFolder = $serializerService->getSerializer()->serialize($currentFolder, 'json');

        return new Response($jsonFolder, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/changeFolder", name="change_folder", methods={"POST"})
     */
    public function changeFolder(Request $request, SessionInterface $session, FolderService $folderService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $folderId = $data['folderId'] ?? null;

        if ($folderId === null) {
            return new JsonResponse(['error' => 'Folder ID is missing'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $folder = $folderService->getFolderById($folderId);

        if ($folder === null) {
            $defaultFolder = $folderService->getFoldersDefault();
            $folder = $defaultFolder[0];
        }

        $session->set('currentFolder', $folder);
        dump($folder);

        return new JsonResponse(['success' => 'Folder changed successfully'], JsonResponse::HTTP_OK);
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

    /**
     * @Route("/delete_folder/{id}", name="delete_folder", methods={"DELETE"}) 
     */
    public function deleteFolder($id, FolderService $folderService): Response
    {
        try {
            $folderService->deleteFolder($id);
            return new Response('Folder successfully deleted', Response::HTTP_OK);
        } catch (\Exception $e) {
            return new Response('Error: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
