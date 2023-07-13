<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

class RegistrationController extends AbstractController
{
    private $authenticator;

    // public function __construct(UserAuthenticatorInterface $authenticator)
    // {
    //     $this->authenticator = $authenticator;
    // }

    // /**
    //  * @Route("/login", name="app_login", methods={"POST"})
    //  */
    // public function login(Request $request, EntityManagerInterface $entityManager, UserProviderInterface $userProvider): Response
    // {
    //     $username = $request->request->get('username');
    //     $password = $request->request->get('password');

    //     $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

    //     if (!$user || $user->getPassword() !== $password) {
    //         return new Response(null, Response::HTTP_UNAUTHORIZED);
    //     }


    //     return new Response(null, Response::HTTP_OK);
    // }

    // /**
    //  * @Route("/logout", name="app_logout", methods={"GET"})
    //  */
    // public function logout()
    // {
    //     throw new \Exception('This method can be blank - it will be intercepted by the logout key on your firewall');
    // }
}
