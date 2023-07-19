<?php

namespace App\Service;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class SerializerService
{
    private $serializer;

    public function __construct()
    {
        $encoder = new JsonEncoder();

        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object) {
                return $object->getId();
            }
        ];

        $normalizer = new ObjectNormalizer(null, null, null, null, null, null, $defaultContext);

        $this->serializer = new Serializer([$normalizer], [$encoder]);
    }

    public function getSerializer(): Serializer
    {
        return $this->serializer;
    }
}
