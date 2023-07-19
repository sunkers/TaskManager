<?php
namespace App\Serializer\Normalizer;

use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactoryInterface;
use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class MaxDepthEnabledObjectNormalizer extends ObjectNormalizer
{
    public function __construct(
        ClassMetadataFactoryInterface $classMetadataFactory,
        array $defaultContext = []
    ) {
        parent::__construct($classMetadataFactory, null, null, null, null, null, $defaultContext);
    }
}
